using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;

namespace Aris.API
{
    public static class Helper
    {
        public static string GetAppSettings(string key)
        {
            var value = ConfigurationManager.AppSettings[key];
            return Convert.ToString(value);
        }

        public static T GetData<T>(HttpResponseMessage httpMessageResponse)
        {
            var data = httpMessageResponse.Content.ReadAsStringAsync().Result;
            return JsonConvert.DeserializeObject<T>(data);
        }

        public static List<T> DataReaderMapToList<T>(IDataReader dr)
        {
            var list = new List<T>();
            var obj = default(T);
            while (dr.Read())
            {
                obj = Activator.CreateInstance<T>();
                foreach (PropertyInfo prop in obj.GetType().GetProperties())
                {
                    if (!object.Equals(dr[prop.Name], DBNull.Value))
                    {
                        prop.SetValue(obj, dr[prop.Name], null);
                    }
                }

                list.Add(obj);
            }
            return list;
        }


        public static HttpClient GetClient(string token)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("Authorization", "UMC " + token);
            return client;
        }
    }
}