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
    /// <returns>Url path as per the configs</returns>
    public static string UrlBuilder(ApiTypeEnum apiTypeEnum, object data = null)
    {
      var url = GetUrlFromConfig(apiTypeEnum, data);
      return url;
    }

    /// <summary>
    /// Returns the query string from the xml string passed to it
    /// </summary>
    /// <param name="xml">The api xml with guids and filters to create a query</param>
    /// <returns>a string with query formation</returns>
    static string GetQueryFromXml(string xml)
    {
      var query = string.Join("&", (
           from parent in XElement.Parse(xml).Elements()
           from child in parent.Elements()
           select "&"
                + HttpUtility.UrlEncode(child.Name.LocalName) + "="
                + HttpUtility.UrlEncode(child.Value)).ToArray());

      query = query.Replace("&&", "&");

      query = query.Remove(0, 1);
      return query;
    }

    /// <summary>
    /// Gets the url from the config file for each api type
    /// </summary>
    /// <param name="apiTypeEnum">Type of api to be fired</param>
    /// <param name="data">Data, if any to be appended in it</param>
    /// <returns></returns>
    static string GetUrlFromConfig(ApiTypeEnum apiTypeEnum, object data = null)
    {
      var url = string.Empty;
      var xmlPath = GetEnumDescription(apiTypeEnum);
      var xml = XDocument.Load(HttpContext.Current.Server.MapPath(xmlPath)).ToString();
      var query = GetQueryFromXml(xml);

      if (apiTypeEnum == ApiTypeEnum.Persons)
      {
        url = BaseUrl + "databases" + DatabaseName + "find?" + query;
      }
      else if (apiTypeEnum == ApiTypeEnum.CreateData)
      {
        url = BaseUrl + DatabaseName + "/" + ModelId;// + "/" + "&updateData=" + Convert.ToString(data) + "";
      }
      else if (apiTypeEnum == ApiTypeEnum.ModelConnection)
      {
        url = BaseUrl + "/models" + DatabaseName + "/" + ModelId + "/" + "?withcontent=true";
      }
      else if (apiTypeEnum == ApiTypeEnum.DeleteData)
      {
        url = BaseUrl + DatabaseName + "/" + ModelId + "/" + "&occId=" + Convert.ToString(data) + "";
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
  }
}
