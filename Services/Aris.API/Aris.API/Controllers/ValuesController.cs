using Aris.API.ApiConfigs;
using Aris.API.Helpers;
using Aris.API.Models;
using Aris.API.Models.Connections;
using Aris.API.Models.Connections.Occ;
using LocationPersonModel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using static Aris.API.Constants;
using static Aris.API.Helper;

namespace Aris.API.Controllers
{
  [EnableCors(origins: "*", headers: "*", methods: "*")]
  public class ValuesController : ApiController
  {
    static string Token { get; set; }

    static int SentColorsIndex { get; set; } = 0;

    readonly IUserSession _userSession;

    public ValuesController()
    { }

    public ValuesController(IUserSession userSession)
    {
      _userSession = userSession;
    }

    [HttpGet]
    [Route("api/Values/Token")]
    public string GetToken()
    {
      var response = new HttpResponseMessage();
      Dictionary<string, string> tokenDetails = null;
      try
      {
        using (var client = new HttpClient())
        {
          var login = new Dictionary<string, string>
                   {
                       { Tenant, GetAppSettings(Tenant) },
                       { Name, GetAppSettings(Name) },
                       { Password, GetAppSettings(Password) },
                       { Key, GetAppSettings(Key)  }
                   };

          using (var formUrlEncodedContent = new FormUrlEncodedContent(login))
          {
            var resp = client.PostAsync(ApiHelper.TokenUrl(), formUrlEncodedContent);
            resp.Wait(TimeSpan.FromSeconds(10));

            if (resp.IsCompleted)
            {
              if (resp.Result.Content.ReadAsStringAsync().Result.Contains("token"))
              {
                tokenDetails = JsonConvert.DeserializeObject<Dictionary<string, string>>(resp.Result.Content.ReadAsStringAsync().Result);
                //Token = tokenDetails["token"];
                //var cookie = new CookieHeaderValue("TokenCookie", tokenDetails["token"])
                //{
                //    HttpOnly = true
                //};

                //response.Headers.AddCookies(new CookieHeaderValue[] { cookie });

                response.StatusCode = System.Net.HttpStatusCode.OK;
                response.Content = new StringContent(tokenDetails["token"]);

                //var options = new AuthenticationProperties
                //{
                //    AllowRefresh = true,
                //    IsPersistent = true
                //    //options.ExpiresUtc = DateTime.UtcNow.AddSeconds(int.Parse(token.expires_in));
                //};


                //var claims = new[]
                //{
                //    //new Claim(ClaimTypes.Name, model.EmailAddress),
                //    new Claim("AccessToken", $"UMC {tokenDetails["token"]}"),
                //};

                //var identity = new ClaimsIdentity(claims, "ApplicationCookie");

                //Request.GetOwinContext().Authentication.SignIn(options, identity);
              }
            }
          }
        }
      }
      catch (Exception ex)
      {
        return "Stack Trace : " + ex.StackTrace + Environment.NewLine + ex.Message;
        //return new HttpResponseMessage { Content = new StringContent("Some exception occured"), RequestMessage  }
      }

      return tokenDetails["token"];
    }

    /// <summary>
    /// Gets the location, supervisor and the team lead information
    /// </summary>
    /// <param name="model">Model to pass the token and other filter parameters</param>
    /// <returns>A data class object with location, supervisor and teamleads list in it</returns>
    [HttpPost]
    [Route("api/Values/Location")]
    public Data Location([FromBody] TokenModel model)
    {
      var token = model.Token;
      var locationName = model.LocationName;
      var rootObject = new Data();
      if (string.IsNullOrEmpty(token))
        return rootObject;

      rootObject = GetLocationSupervisor(token);

      return rootObject;
    }

    [HttpPost]
    [Route("api/Values/Persons")]
    public IEnumerable<Person> Persons([FromBody] TokenModel model)
    {
      var url = ApiHelper.UrlBuilder(ApiTypeEnum.Persons);
      IEnumerable<Person> filteredData = null;
      var token = model.Token;
      var locationName = model.LocationName;
      var supervisorName = model.SupervisorName;
      var personName = model.PersonName;
      var rootObject = new List<Person>();
      if (string.IsNullOrWhiteSpace(token))
        return rootObject;

      rootObject = GetPersons(url, token, locationName, supervisorName);
      if (string.IsNullOrEmpty(locationName) && string.IsNullOrEmpty(supervisorName) && string.IsNullOrEmpty(personName))
      {
        throw new HttpResponseException(HttpStatusCode.BadRequest);
      }

      if (!string.IsNullOrEmpty(locationName) && !string.IsNullOrEmpty(supervisorName) && string.IsNullOrEmpty(personName))
      {
        // this is not the search person case
        // get all the persons based on the location and the supervisor
        filteredData = rootObject.Where(i => i.LocationName.Trim().ToLower() == locationName.Trim().ToLower()
                                         && i.SupervisorName.Trim().ToLower() == supervisorName.Trim().ToLower()).ToList();
      }
      else if (!string.IsNullOrEmpty(locationName) && !string.IsNullOrEmpty(supervisorName) && !string.IsNullOrEmpty(personName))
      {
        // this is the person search case
        // get all the persons based on the search person text
        // these persons will also have the property whether ther are already saved for that location or not
        filteredData = rootObject.Where(i => i.Name.Trim().ToLower().StartsWith(personName.Trim().ToLower(), StringComparison.Ordinal)).ToList();
      }

      return filteredData;
    }

    [HttpPost]
    [Route("api/Values/Jobs")]
    public List<Person> Jobs([FromBody] TokenModel model)
    {
      var token = model.Token;
      //var teamLeadName = model.TeamLeadName;
      var personName = model.PersonName;
      var rootObject = new List<Person>();
      if (string.IsNullOrWhiteSpace(token))
        return rootObject;


      using (var client = new HttpClient())
      {
        client.DefaultRequestHeaders.Clear();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("Authorization", "UMC " + token);

        var jsonPost = JobQuery.JobQueryData(model.PersonId);

        using (var stringContent = new StringContent(jsonPost, Encoding.UTF8, "application/json"))
        {
          var response = client.PostAsync("http://10.10.20.65:90/abs/api/objects/.CSL%20Behring_DEV/query", stringContent).Result;
          if (response.IsSuccessStatusCode)
          {
            var data = GetData<JobRole>(response);
            var organizationalUnit = "Organizational unit type".Trim().ToLower();
            foreach (var obj in data.items)
            {
              var jobList = new List<Job>();
              var roleList = new List<Role>();
              var person = new Person
              {
                PersonId = obj.item.guid,
                Name = Convert.ToString(obj.item.attributes.Select(i => i.value).FirstOrDefault()),
                LocationName = model.LocationName,
                TeamLeadName = model.TeamLeadName,
                SupervisorName = model.SupervisorName,
              };

              var job = new Job
              {
                PersonId = person.PersonId,
                PersonName = person.Name
              };

              var role = new Role
              {
                PersonId = person.PersonId,
                PersonName = person.Name
              };

              foreach (var descendant in obj.descendants)
              {
                var jobToAdd = new Job { JobName = job.JobName, PersonId = job.PersonId, PersonName = job.PersonName };
                var roleToAdd = new Role { RoleName = role.RoleName, PersonId = job.PersonId, PersonName = job.PersonName };
                var value = Convert.ToString(descendant.item.attributes.Select(i => i.value).FirstOrDefault());
                var type = descendant.item.typename;
                if (type == "Organizational unit type")
                {
                  var color = GetKnownColor();
                  // this is a job
                  jobToAdd.JobName = value;
                  jobToAdd.JobId = descendant.item.guid;
                  jobToAdd.Color = color;
                  jobList.Add(jobToAdd);

                  var rolesByJob = GetRolesByJob(token, jobToAdd.Color, jobToAdd.JobId);
                  foreach (var jobRelatedRole in rolesByJob.JobRoles)
                  {
                    // role id,job id, person id
                    //if (person.JobRelatedRoles == null)
                    //{
                    //  person.JobRelatedRoles = new List<Role>();
                    //}
                    //person.JobRelatedRoles.Add(jobRelatedRole);
                    roleList.Add(jobRelatedRole);
                    //roleList.Add(roleBJ);
                  }
                }
                else if (type == "Role")
                {
                  // this is a role
                  roleToAdd.RoleName = value;
                  roleToAdd.RoleId = descendant.item.guid;
                  roleList.Add(roleToAdd);
                }
              }

              person.Jobs = jobList;
              person.Roles = roleList;
              rootObject.Add(person);
            }
          }
        }
      }

      //foreach (var person in rootObject)
      //{
      //  foreach (var job in person.Jobs)
      //  {
      //    var color = GetKnownColor();
      //    var rolesByJob = GetRolesByJob(token, color, job.JobId);
      //      job.JobRoles = rolesByJob.JobRoles;
      //   // job.Color = color;
      //  }
      //}

      if (!string.IsNullOrEmpty(personName))
        return rootObject.Where(i => i.Name.Trim().ToLower() == personName.Trim().ToLower()).ToList();

      return rootObject;
    }

    [HttpPost]
    [Route("api/Values/GetAllJobs")]
    public List<Job> GetAllJobs([FromBody] TokenModel model)
    {
      var token = model.Token;
      var jobName = model.JobName;
      var rootObject = new List<Aris.API.Models.Job>();
      if (string.IsNullOrWhiteSpace(token))
        return rootObject;

      rootObject = GetAllJobs(token);

      return rootObject.Where(i => i.JobName.Trim().ToLower().StartsWith(jobName.Trim().ToLower(), StringComparison.Ordinal)).ToList();
    }

    [HttpPost]
    [Route("api/Values/GetAllRoles")]
    public List<Role> GetAllRoles([FromBody] TokenModel model)
    {
      var token = model.Token;
      var roleName = model.RoleName;
      var rootObject = new List<Role>();
      if (string.IsNullOrWhiteSpace(token))
        return rootObject;

      rootObject = GetAllRoles(token);

      return rootObject.Where(i => i.RoleName.Trim().ToLower().StartsWith(roleName.Trim().ToLower(), StringComparison.Ordinal)).ToList();
    }

    [HttpPost]
    [Route("api/Values/GetAllBackups")]
    public List<Person> GetAllBackups([FromBody] TokenModel model)
    {
      var token = model.Token;
      var personName = model.BackupName;
      var rootObject = new List<Person>();
      if (string.IsNullOrWhiteSpace(token))
        return rootObject;

      rootObject = GetAllBackups(token);

      return rootObject.Where(i => i.Name.Trim().ToLower().StartsWith(personName.Trim().ToLower(), StringComparison.Ordinal)).ToList();
    }

    [HttpPost]
    [Route("api/Values/GetRolesByJob")]
    public Job GetRolesByJob([FromBody] TokenModel model)
    {
      var token = model.Token;
      var jobId = model.JobId;
      var jobName = model.JobName;
      var color = model.Color;
      var rootObject = GetRolesByJob(token, color, jobId);
      rootObject.JobName = model.JobName;
      rootObject.JobId = jobId;
      return rootObject;
    }

    [HttpPost]
    [Route("api/Values/GetBackupsByRole")]
    public Role GetBackupsByRole([FromBody] TokenModel model)
    {
      var token = model.Token;
      var jobId = model.JobId;
      var jobName = model.JobName;
      var roleid = model.RoleId;
      var roleName = model.RoleName;
      var color = model.Color;
      var root = GetBackupsByRole(token, color, roleid);
      root.RoleName = roleName;
      return root;
    }

    [HttpPost]
    [Route("api/Values/UpdateAris")]
    public void UpdateAris([FromBody] MappingList model)
    {
      var token = model.Token;
      
      // deserialize the whole json to object
      var mappingData = model.modelToSave;// JsonConvert.DeserializeObject<List<Mapping>>(modelToSave);


      var createdItems = mappingData.Where(i => i.Status == "New").ToList();
      var deletedItems = mappingData.Where(i => i.Status == "Deleted").ToList();

      foreach (var createdItem in createdItems)
      {
        // model object for the person
        var modelObject = new Models.Connections.Modelobject
        {
          kind = "MODELOBJECT",
          occid = "#1",
          type = 46,
          symbol = (int)2,
          guid = createdItem.PersonId,
          attributes = new List<Models.Connections.Attribute>
          {
            new Models.Connections.Attribute
            {
              kind = "ATTRIBUTE", type=1,value= createdItem.Person
            },
            // location update
            new Models.Connections.Attribute
            {
              kind = "ATTRIBUTE", type= "8de0d080-4df4-11e8-3e7a-0296de82851c", value = createdItem.Location
            },
            // supervisor update
            new Models.Connections.Attribute
            {
              kind = "ATTRIBUTE", type= "967c08d1-4f71-11e8-6a1e-d89d672712a8",value= createdItem.Supervisor
            }
          }
        };

        if (!string.IsNullOrEmpty(createdItem.JobId))
        {
          var createConnections = new List<CreateConnection>();
          // model for job will be created
          // create model object for the job here
          var modelObjectJob = new Models.Connections.Modelobject
          {
            kind = "MODELOBJECT",
            occid = "#2",
            type = 44,
            symbol = (int)299,
            guid = createdItem.JobId,
            attributes = new List<Models.Connections.Attribute>
              {
                new Models.Connections.Attribute{ kind= "ATTRIBUTE", type=1, value =  createdItem.JobName }
              }
          };


          var modelConnection = new Models.Connections.Modelconnection { kind = "MODELCONNECTION", type = 395, source_occid = "#1", target_occid = "#2" };

          var createdConnection = new CreateConnection
          {
            modelconnections = new List<Models.Connections.Modelconnection> { modelConnection },
          };

          if (createdConnection.modelobjects == null)
          {
            createdConnection.modelobjects = new List<Models.Connections.Modelobject>();
          }

          createdConnection.modelobjects.Add(modelObject);
          createdConnection.modelobjects.Add(modelObjectJob);
          createConnections.Add(createdConnection);

          var updateData = JsonConvert.SerializeObject(createConnections);
          // remove first [
          updateData = updateData.Substring(1);
          // remove last ]
          updateData = updateData.Remove(updateData.Length - 1);

          var createUrl = ApiHelper.UrlBuilder(ApiTypeEnum.CreateData);

          using (var stringContent = new StringContent(updateData, Encoding.UTF8, "application/json"))
          {
            var response = GetRawResponse(token, createUrl, HttpTypeEnum.Put, stringContent);
          }

        }

        // person to role model will be created here
        if (!string.IsNullOrEmpty(createdItem.RoleId))
        {
          var createConnections = new List<CreateConnection>();
          // model for job will be created
          // create model object for the job here
          var modelObjectRole = new Models.Connections.Modelobject
          {
            kind = "MODELOBJECT",
            occid = "#2",
            type = 78,
            symbol = "80f76b81-35b8-11e3-51cf-c1dbe7832b20",
            guid = createdItem.RoleId,
            attributes = new List<Models.Connections.Attribute>
              {
                new Models.Connections.Attribute{ kind= "ATTRIBUTE", type=1, value =  createdItem.RoleName }
              }
          };


          var modelConnection = new Models.Connections.Modelconnection { kind = "MODELCONNECTION", type = 480, source_occid = "#1", target_occid = "#2" };

          var createdConnection = new CreateConnection
          {
            modelconnections = new List<Models.Connections.Modelconnection> { modelConnection },
          };

          if (createdConnection.modelobjects == null)
          {
            createdConnection.modelobjects = new List<Models.Connections.Modelobject>();
          }

          createdConnection.modelobjects.Add(modelObject);
          createdConnection.modelobjects.Add(modelObjectRole);
          createConnections.Add(createdConnection);

          var updateData = JsonConvert.SerializeObject(createConnections);
          // remove first [
          updateData = updateData.Substring(1);
          // remove last ]
          updateData = updateData.Remove(updateData.Length - 1);

          var createUrl = ApiHelper.UrlBuilder(ApiTypeEnum.CreateData);

          using (var stringContent = new StringContent(updateData, Encoding.UTF8, "application/json"))
          {
            var response = GetRawResponse(token, createUrl, HttpTypeEnum.Put, stringContent);
          }

        }

        if (!string.IsNullOrEmpty(createdItem.BackupId))
        {
          var createConnections = new List<CreateConnection>();
          // model object for the person
          var modelObjectRole = new Models.Connections.Modelobject
          {
            kind = "MODELOBJECT",
            occid = "#1",
            type = 46,
            symbol = (int)2,
            guid = createdItem.BackupId,
            attributes = new List<Models.Connections.Attribute>
          {
            new Models.Connections.Attribute {  kind= "ATTRIBUTE", type=1,value= createdItem.Backup }
          }
          };

          // create the connection for the backup here
          // model for job will be created
          // create model object for the job here
          var modelObjectBackup = new Models.Connections.Modelobject
          {
            kind = "MODELOBJECT",
            occid = "#2",
            type = 78,
            symbol = "80f76b81-35b8-11e3-51cf-c1dbe7832b20",
            guid = createdItem.RoleId,
            attributes = new List<Models.Connections.Attribute>
              {
                new Models.Connections.Attribute{ kind= "ATTRIBUTE", type=1, value =  createdItem.RoleName }
              }
          };


          var modelConnectionBackup = new Models.Connections.Modelconnection { kind = "MODELCONNECTION", type = 61, source_occid = "#1", target_occid = "#2" };

          var createdConnectionBackup = new CreateConnection
          {
            modelconnections = new List<Models.Connections.Modelconnection> { modelConnectionBackup },
          };

          if (createdConnectionBackup.modelobjects == null)
          {
            createdConnectionBackup.modelobjects = new List<Models.Connections.Modelobject>();
          }

          createdConnectionBackup.modelobjects.Add(modelObjectRole);
          createdConnectionBackup.modelobjects.Add(modelObjectBackup);
          createConnections.Add(createdConnectionBackup);

          var updateData = JsonConvert.SerializeObject(createConnections);
          // remove first [
          updateData = updateData.Substring(1);
          // remove last ]
          updateData = updateData.Remove(updateData.Length - 1);

          var createUrl = ApiHelper.UrlBuilder(ApiTypeEnum.CreateData);

          using (var stringContent = new StringContent(updateData, Encoding.UTF8, "application/json"))
          {
            var response = GetRawResponse(token, createUrl, HttpTypeEnum.Put, stringContent);
          }
        }

        //var updateData = JsonConvert.SerializeObject(createConnections);
        //// remove first [
        //updateData = updateData.Substring(1);
        //// remove last ]
        //updateData = updateData.Remove(updateData.Length - 1);

        //var createUrl = ApiHelper.UrlBuilder(ApiTypeEnum.CreateData);

        //using (var stringContent = new StringContent(updateData, Encoding.UTF8, "application/json"))
        //{
        //  var response = GetRawResponse(token, createUrl, HttpTypeEnum.Put, stringContent);
        //}
      }


      #region Delete data from ARIS
      // call the occ id connection api if there is any data in deleted items
      if (deletedItems != null && deletedItems.Count > 0)
      {
        // get connection id from the database for this database and model guid
        var modelConnectionUrl = ApiHelper.UrlBuilder(ApiTypeEnum.ModelConnection);
        var responseJson = GetRawResponse(token, modelConnectionUrl);
        var data = JsonConvert.DeserializeObject<OccsRootObject>(responseJson);
        //var parsed = JObject.Parse(responseJson);
        //var modelConnectionsJson = parsed["items"]["modelconnections"];
      
        var modelConnections = new List<OccurenceConnection>();
        foreach (var item in data.items)
        {
          foreach (var mc in item.modelconnections)
          {
            modelConnections.Add(new OccurenceConnection
            {
              kind =       mc.kind,
              occid =       mc.occid,
              //type =        mc.type,
              typename =    mc.typename,
              apiname =     mc.apiname,
              target_guid = mc.target_guid,
              source_guid = mc.source_guid,
              //source_link = mc.source_link,
              //target_link = mc.target_link,
              source_occid = mc.source_occid,
              target_occid = mc.target_occid
            });
          }
        }

        // loop through the deleted items
        foreach (var deletedItem in deletedItems)
        {
          var personGuid = deletedItem.PersonId;
          if (!string.IsNullOrEmpty(deletedItem.JobId))
          {
            var jobGuid = deletedItem.JobId;
            var occId = modelConnections.Where(i => string.Equals(i.source_guid, personGuid, StringComparison.InvariantCultureIgnoreCase)
                                              && string.Equals(i.target_guid, jobGuid, StringComparison.InvariantCultureIgnoreCase))
                                              .Select(i => i.occid).FirstOrDefault();
            var encodedOccId = HttpUtility.UrlEncode(occId);
            if (!string.IsNullOrEmpty(occId))
            {
              var jobDeleteurl = ApiHelper.UrlBuilder(ApiTypeEnum.DeleteData, encodedOccId);
              var response = GetRawResponse(token, jobDeleteurl, HttpTypeEnum.Delete);
            }
          }

          // person to role model will be created here
          if (!string.IsNullOrEmpty(deletedItem.RoleId))
          {
            var roleGuid = deletedItem.RoleId;
            var occId = modelConnections.Where(i => string.Equals(i.source_guid, personGuid, StringComparison.InvariantCultureIgnoreCase)
                                              && string.Equals(i.target_guid, roleGuid, StringComparison.InvariantCultureIgnoreCase))
                                              .Select(i => i.occid).FirstOrDefault();

            var encodedOccId = HttpUtility.UrlEncode(occId);

            if (!string.IsNullOrEmpty(occId))
            {
              var roleDeleteUrl = ApiHelper.UrlBuilder(ApiTypeEnum.DeleteData, encodedOccId);

              var response = GetRawResponse(token, roleDeleteUrl, HttpTypeEnum.Delete);

            }
          }
        }
      }
      #endregion
    }

    static string GetKnownColor()
    {
      var colorList = ColorHelper.GetColors();

      if (SentColorsIndex == colorList.Count)
      {
        SentColorsIndex = 0;
      }
      var color = colorList.ElementAt(SentColorsIndex);
      SentColorsIndex += 1;
      return color;
    }

    Data GetLocationSupervisor(string token)
    {
      var objData = new Data();
      var locations = new List<Location>();
      var supervisors = new List<Supervisor>();
      var teamLeads = new List<TeamLead>();
      const string url = "http://10.10.20.65:90/abs/api/databases/.CSL%20Behring_DEV/find?kind=OBJECT&methodfilter=17658890-ea42-11e6-21fb-0acb454164fe&attributes=1%2C1243%2C3757%2C8de0d080-4df4-11e8-3e7a-0296de82851c%2C%20&attributes=967c08d1-4f71-11e8-6a1e-d89d672712a8%2C75d2ad01-4f71-11e8-6a1e-d89d672712a8&attrfilter=8de0d080-4df4-11e8-3e7a-0296de82851c%20%2B";
      var data = GetResponse<LocationPerson>(token, url);

      foreach (var item in data.items)
      {
        var location_Name = string.Empty;
        var supervisorName = string.Empty;
        var teamLeadName = string.Empty;
        var locationId = string.Empty;
        var supervisorId = string.Empty;
        var teamLeadId = string.Empty;

        foreach (var attribute in item.attributes)
        {
          switch (attribute.typename)
          {
            case "CSL Location":
              location_Name = attribute.value;
              locationId = attribute.type_guid;
              break;
            case "CSL Team Lead":
              teamLeadName = attribute.value;
              teamLeadId = attribute.type_guid;
              break;
            case "CSL Supervisor":
              supervisorName = attribute.value;
              supervisorId = attribute.type_guid;
              break;
            default:
              break;
          }
        }

        if (!locations.Any(i => i.Name.Trim().ToLower() == location_Name.Trim().ToLower()))
        {
          locations.Add(new Location { Id = locationId, Name = location_Name, Color = "white" });
        }

        if (!supervisors.Any(i => i.Name.Trim().ToLower() == supervisorName.Trim().ToLower()))
        {
          supervisors.Add(new Supervisor { Id = supervisorId, Name = supervisorName, Color = "white" });
        }

        if (!teamLeads.Any(i => i.Name.Trim().ToLower() == teamLeadName.Trim().ToLower()))
        {
          teamLeads.Add(new TeamLead { Id = teamLeadId, Name = teamLeadName, Color = "white" });
        }
      }

      objData.Locations = locations.OrderBy(i => i.Name).ToList();
      objData.Supervisors = supervisors.OrderBy(i => i.Name).ToList();
      objData.TeamLeads = teamLeads.OrderBy(i => i.Name).ToList();

      return objData;
    }

    List<Person> GetPersons(string url, string token, string locationName, string supervisorName)
    {
      var persons = new List<Person>();
      var url1 = "http://10.10.20.65:90/abs/api/databases/.CSL%20Behring_DEV/find?kind=OBJECT&methodfilter=17658890-ea42-11e6-21fb-0acb454164fe&attributes=1%2C1243%2C3757%2C8de0d080-4df4-11e8-3e7a-0296de82851c%2C967c08d1-4f71-11e8-6a1e-d89d672712a8%2C75d2ad01-4f71-11e8-6a1e-d89d672712a8&typefilter=46&attrfilter=8de0d080-4df4-11e8-3e7a-0296de82851c%20%2B";
      var data = GetResponse<LocationPerson>(token, url1);

      foreach (var item in data.items)
      {
        var personId = item.guid;
        var location_Name = string.Empty;
        var supervisor_Name = string.Empty;
        var personName = string.Empty;
        var teamLeadName = string.Empty;

        foreach (var attribute in item.attributes)
        {
          if (attribute.typename == "CSL Location")
          {
            location_Name = attribute.value;
          }
          else if (attribute.typename == "CSL Team Lead")
          {
            teamLeadName = attribute.value;
          }
          else if (attribute.typename == "CSL Supervisor")
          {
            supervisor_Name = attribute.value;
          }
          else if (attribute.typename == "Name")
          {
            personName = attribute.value;
          }
        }

        //if (string.IsNullOrEmpty(Convert.ToString(location_Name))
        //    || string.IsNullOrEmpty(Convert.ToString(supervisor_Name))
        //    || string.IsNullOrEmpty(Convert.ToString(personName))
        //    )
        //{
        //    continue;
        //}

        var person = new Person { PersonId = personId, Name = personName, LocationName = location_Name, SupervisorName = supervisor_Name };
        person.HasMapping = string.Equals(person.LocationName, locationName, StringComparison.OrdinalIgnoreCase) &&
                            string.Equals(person.SupervisorName, supervisorName, StringComparison.OrdinalIgnoreCase);
        persons.Add(person);
      }

      return persons.Distinct().ToList();
    }

    List<Role> GetAllRoles(string token)
    {
      var roles = new List<Role>();
      const string url = "http://10.10.20.65:90/abs/api/databases/.CSL%20Behring_DEV/find?kind=OBJECT&typefilter=78&defsymbolfilter=80f76b81-35b8-11e3-51cf-c1dbe7832b20";
      var data = GetResponse<Models.RoleHelper.RoleMapper>(token, url);

      foreach (var item in data.items)
      {
        var color = GetKnownColor();
        var guid = item.guid;

        foreach (var attribute in item.attributes)
        {
          var roleName = attribute.value;
          roles.Add(new Role { RoleId = guid, RoleName = roleName, Color = color });
        }
      }

      return roles.Distinct().ToList();
    }

    List<Job> GetAllJobs(string token)
    {
      var jobs = new List<Job>();

      const string url = "http://10.10.20.65:90/abs/api/databases/.CSL%20Behring_DEV/find?kind=OBJECT&typefilter=44&defsymbolfilter=299";
      var data = GetResponse<Models.JobHelper.JobMapper>(token, url);

      foreach (var item in data.items)
      {
        var color = GetKnownColor();
        var guid = item.guid;
        foreach (var attribute in item.attributes)
        {
          var jobName = attribute.value;
          jobs.Add(new Aris.API.Models.Job { JobId = guid, JobName = jobName, Color = color });
        }
      }

      return jobs.Distinct().ToList();
    }

    List<Person> GetAllBackups(string token)
    {
      var persons = new List<Person>();
      const string url = "http://10.10.20.65:90/abs/api/databases/.CSL%20Behring_DEV/find?kind=OBJECT&typefilter=46&defsymbolfilter=2";
      var data = GetResponse<LocationPerson>(token, url);

      foreach (var item in data.items)
      {
        var guid = item.guid;

        foreach (var attribute in item.attributes)
        {
          var backupName = attribute.value;
          persons.Add(new Person { Name = backupName, PersonId = guid });
        }
      }

      return persons.Distinct().ToList();
    }

    Job GetRolesByJob(string token, string color, string jobId)
    {
      var rootObject = new Job
      {
        JobId = jobId,
        Color = color,
        JobRoles = new List<Role>()
      };
      if (string.IsNullOrWhiteSpace(token))
        return rootObject;
      
      var jsonPost = "{ \"start_guids\": \" " + jobId + " \",   \"items\": [ {  \"type\": \"CONNECTION\",  \"direction\": \"OUT\",  \"items\": [{ \"type\": \"OBJECT\", \"typenum\": \"78\", \"function\": \"TARGET\" } ] }  ] }";

      using (var client = new HttpClient())
      {
        client.DefaultRequestHeaders.Clear();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("Authorization", "UMC " + token);
        
        using (var stringContent = new StringContent(jsonPost, Encoding.UTF8, "application/json"))
        {
          var response = client.PostAsync("http://10.10.20.65:90/abs/api/objects/.CSL%20Behring_DEV/query", stringContent).Result;
          if (response.IsSuccessStatusCode)
          {
            var data = GetData<Aris.API.Models.RoleHelper.RoleByJob.RolesByJob>(response);
            foreach (var item in data.items)
            {
              var jobGuid = item.item.guid;
              foreach (var attribute in item.item.attributes)
              {
                var jobName = attribute.value;
                rootObject.JobId = jobId;
                rootObject.JobName = jobName;
              }

              // roles to be fetched here
              foreach (var descendant in item.descendants)
              {
                var roleId = descendant.item.guid;

                foreach (var attribute in descendant.item.attributes)
                {
                  var roleName = attribute.value;
                  rootObject.JobRoles.Add(new Role { RoleId = roleId, RoleName = roleName, Color = color, JobId = jobId });
                }
              }
            }
          }
        }
      }

      return rootObject;
    }

    Role GetBackupsByRole(string token, string color, string roleId)
    {
      var rootObject = new Role
      {
        Backups = new List<Person>()
      };

      if (string.IsNullOrWhiteSpace(token))
        return rootObject;

      using (var client = new HttpClient())
      {
        client.DefaultRequestHeaders.Clear();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("Authorization", "UMC " + token);

        var jsonPost = "{ \"start_guids\": \"" + roleId + "\", \"items\": [ { \"type\": \"CONNECTION\", \"direction\": \"INOUT\", \"items\": [ { \"type\": \"OBJECT\", \"typenum\": \"46\", \"function\": \"TARGET\" } ]   }  ]}";

        using (var stringContent = new StringContent(jsonPost, Encoding.UTF8, "application/json"))
        {
          var response = client.PostAsync("http://10.10.20.65:90/abs/api/objects/.CSL%20Behring_DEV/query", stringContent).Result;
          if (response.IsSuccessStatusCode)
          {
            var data = GetData<Aris.API.Models.RoleHelper.RoleByJob.RolesByJob>(response);
            foreach (var item in data.items)
            {
              var roleguid = item.item.guid;
              foreach (var attribute in item.item.attributes)
              {
                var roleName = attribute.value;
                rootObject.RoleId = roleguid;
                rootObject.RoleName = roleName;
              }

              // roles to be fetched here
              foreach (var descendant in item.descendants)
              {
                var backupId = descendant.item.guid;

                foreach (var attribute in descendant.item.attributes)
                {
                  var backupName = attribute.value;
                  rootObject.Backups.Add(new Person { PersonId = backupId, Name = backupName, Color = color });
                }
              }
            }
          }
        }
      }

      return rootObject;
    }
  }
}




public interface IUserSession
{
  string BearerToken { get; }
}

public class UserSession : IUserSession
{
  public string BearerToken
  {
    get { return ((ClaimsPrincipal)HttpContext.Current.User).FindFirst("AccessToken").Value; }
  }
}


namespace LocationPersonModel
{
  public class Link
  {
    public string kind { get; set; }
    public string method { get; set; }
    public string href { get; set; }
    public string rel { get; set; }
  }

  public class Attribute
  {
    public string kind { get; set; }
    public string id { get; set; }
    public string typename { get; set; }
    public int type { get; set; }
    public string apiname { get; set; }
    public string language { get; set; }
    public string value { get; set; }
    public string type_guid { get; set; }
  }

  public class Item
  {
    public string kind { get; set; }
    public string guid { get; set; }
    public Link link { get; set; }
    public string typename { get; set; }
    public int type { get; set; }
    public int default_symbol { get; set; }
    public string apiname { get; set; }
    public List<Attribute> attributes { get; set; }
  }

  public class LocationPerson
  {
    public string kind { get; set; }
    public string request { get; set; }
    public string status { get; set; }
    public int item_count { get; set; }
    public string next_pagetoken { get; set; }
    public List<Item> items { get; set; }
  }
}
