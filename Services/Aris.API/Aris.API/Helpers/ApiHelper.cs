using Aris.API.ApiConfigs;
using System;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using static Aris.API.Helper;

namespace Aris.API.Helpers
{
  public class ApiHelper
  {
    /// <summary>
    /// Gets the base url from the config
    /// </summary>
    static string BaseUrl
    { get { return GetAppSettings("BaseUrl"); } }

    /// <summary>
    /// Gets the database name from the config
    /// </summary>
    static string DatabaseName
    { get { return GetAppSettings("DatabaseName"); } }

    /// <summary>
    /// Gets the model name from the config
    /// </summary>
    static string ModelId
    { get { return GetAppSettings("ModelId"); } }

    /// <summary>
    /// Get the location attribute guid from the config
    /// </summary>
    static string LocationAttributeGuid
    {
      get { return GetAppSettings("LocationAttributeGuid"); }
    }

    /// <summary>
    /// Get the location attribute guid from the config
    /// </summary>
    static string SupervisorAttributeGuid
    {
      get { return GetAppSettings("SupervisorAttributeGuid"); }
    }

    /// <summary>
    /// Gets the url from the config to get the token api path
    /// </summary>
    /// <returns></returns>
    public static string TokenUrl()
    {
      return GetAppSettings("TokenUrl");
    }

    /// <summary>
    /// This build a url path as per the api configs
    /// </summary>
    /// <param name="apiTypeEnum">API Type enums</param>
    /// <param name="data">Data to be appended at the end of the url</param>
    /// <param name="hasXmlConfigured">bool flag to set if the url is to be contstructed from xml</param>
    /// <returns>Url path as per the configs</returns>
    public static string UrlBuilder(ApiTypeEnum apiTypeEnum, object data = null, bool hasXmlConfigured = true)
    {
      var url = GetUrlFromConfig(apiTypeEnum, data, hasXmlConfigured);
      return url;
    }

    /// <summary>
    /// Returns the query string from the xml string passed to it
    /// </summary>
    /// <param name="xml">The api xml with guids and filters to create a query</param>
    /// <returns>a string with query formation</returns>
    static string GetQueryFromXml(string xml)
    {
      if (string.IsNullOrEmpty(xml)) return string.Empty;
       
      var query = string.Join("&", (
           from parent in XElement.Parse(xml).Elements()
           from child in parent.Elements()
           select "&"
                + HttpUtility.UrlEncode(child.Name.LocalName) + "="
                + HttpUtility.UrlEncode(child.Value)).ToArray());

      if (string.IsNullOrEmpty(query)) return string.Empty;

      query = query.Replace("&&", "&");

      query = query.Remove(0, 1);
      return query;
    }

    /// <summary>
    /// Gets the url from the config file for each api type
    /// </summary>
    /// <param name="apiTypeEnum">Type of api to be fired</param>
    /// <param name="data">Data, if any to be appended in it</param>
    /// <param name="hasXmlConfigured">Check if the url is to be composed from an xml. Default true</param>
    /// <returns></returns>
    static string GetUrlFromConfig(ApiTypeEnum apiTypeEnum, object data = null, bool hasXmlConfigured = true)
    {
      var url = string.Empty;
      var xmlPath = string.Empty;
      var xml = string.Empty;
      var query = string.Empty;

      if (hasXmlConfigured)
      {
        xmlPath = GetEnumDescription(apiTypeEnum);
        xml = XDocument.Load(HttpContext.Current.Server.MapPath(xmlPath)).ToString();
        query = GetQueryFromXml(xml);
      }
      

      if (apiTypeEnum == ApiTypeEnum.Persons
        || apiTypeEnum == ApiTypeEnum.AllBackups)
      {
        url = BaseUrl + "databases" + DatabaseName + "find?" + query;
      }
      else if (apiTypeEnum == ApiTypeEnum.CreateData)
      {
        url = BaseUrl + "/models"+ DatabaseName + ModelId;// + "/" + "&updateData=" + Convert.ToString(data) + "";
      }
      else if (apiTypeEnum == ApiTypeEnum.ModelConnection)
      {
        url = BaseUrl + "/models" + DatabaseName + "/" + ModelId + "/" + "?withcontent=true";
      }
      else if (apiTypeEnum == ApiTypeEnum.DeleteData)
      {
        url = BaseUrl + "models" + DatabaseName + ModelId + "/connections" + "?occid=" + Convert.ToString(data) + "";
      }
      else if(apiTypeEnum == ApiTypeEnum.BackupsByRole
        || apiTypeEnum == ApiTypeEnum.RolesByJob
        || apiTypeEnum == ApiTypeEnum.Jobs)
      {
        url = BaseUrl + "objects" + DatabaseName + "query";
      }
      

      return url;
    }

    /// <summary>
    /// Gets the description from the enum
    /// </summary>
    /// <param name="value"></param>
    /// <returns></returns>
    static string GetEnumDescription(ApiTypeEnum value)
    {
      var fi = value.GetType().GetField(value.ToString());

      var attributes =
          (DescriptionAttribute[])fi.GetCustomAttributes(
          typeof(DescriptionAttribute),
          false);

      if (attributes != null && attributes.Length > 0)
      {
        return attributes[0].Description;
      }

      return value.ToString();
    }

    /// <summary>
    /// Appends the next page token to the url
    /// </summary>
    /// <param name="url">Url to which the next page token is to be appended</param>
    /// <param name="nextPageToken">The next page token</param>
    /// <returns></returns>
    public static string AppendNextPageToken(string url, string nextPageToken)
    {
      url += "&pagetoken = " + nextPageToken + "";
      return url;
    }
  }
}
