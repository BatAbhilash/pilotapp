using Aris.API.ApiConfigs;
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
        /// Gets the url from the config to get the token api path
        /// </summary>
        /// <returns></returns>
        public static string TokenUrl()
        {
            return GetAppSettings("TokenUrl");
        }

        /// <summary>
        /// Gets the url from the config file for each api type
        /// </summary>
        /// <param name="apiTypeEnum">Type of api to be fired</param>
        /// <returns></returns>
        static string GetUrlFromConfig(ApiTypeEnum apiTypeEnum)
        {
            var url = string.Empty;

            if (apiTypeEnum == ApiTypeEnum.Persons)
            {
                var xml = XDocument.Load(HttpContext.Current.Server.MapPath("~/ApiConfigs/PersonApi.xml")).ToString();
                var query = string.Join("&", (
            from parent in XElement.Parse(xml).Elements()
            from child in parent.Elements()
            select "&"
                 + HttpUtility.UrlEncode(child.Name.LocalName) + "="
                 + HttpUtility.UrlEncode(child.Value)).ToArray());

                query = query.Replace("&&", "&");

                query = query.Remove(0, 1);

                url = BaseUrl + "databases" + DatabaseName + "find?" + query;
            }

            return url;
        }

        /// <summary>
        /// This build a url path as per the api configs
        /// </summary>
        /// <param name="apiTypeEnum"></param>
        /// <returns>Url path as per the configs</returns>
        public static string UrlBuilder(ApiTypeEnum apiTypeEnum)
        {
            var url = GetUrlFromConfig(apiTypeEnum);
            return url;
        }
    }
}