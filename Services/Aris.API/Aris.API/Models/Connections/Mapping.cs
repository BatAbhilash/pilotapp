using Newtonsoft.Json;

namespace Aris.API.Models.Connections
{
  public class MappingList
  {
    public System.Collections.Generic.List<Mapping> modelToSave;
    public string Token;
  }

  public class Mapping
  {
    public string Backup { get; set; }
    public string BackupId { get; set; }
    public string JobId { get; set; }
    public string JobName { get; set; }
    public string Location { get; set; }

    public string LocationId { get; set; }

    [JsonProperty("Name")]
    public string Person { get; set; }

    public string PersonId { get; set; }

    public string RoleId { get; set; }

    public string RoleName { get; set; }

    public string Status { get; set; }

    [JsonProperty("Supervisors")]
    public string Supervisor { get; set; }

    [JsonProperty("SupervisorsId")]
    public string SupervisorId { get; set; }
    [JsonProperty("HeadId")]
    public string TeamLeadId { get; set; }

    [JsonProperty("Head")]
    public string TeamLeadName { get; set; }
  }
}
