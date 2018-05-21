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



    /// <summary>
    /// Return client based on the token header
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    public static HttpClient GetClient(string token)
    {
      var client = new HttpClient();
      client.DefaultRequestHeaders.Clear();
      client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
      client.DefaultRequestHeaders.Add("Authorization", "UMC " + token);
      return client;
    }

    /// <summary>
    /// Gets the response based on the url and token passed
    /// </summary>
    /// <typeparam name="T">Type of class T which is passed to get the response</typeparam>
    /// <param name="token"></param>
    /// <param name="url"></param>
    /// <returns></returns>
    public static T GetResponse<T>(string token, string url)
    {
      using (var client = GetClient(token))
      {
        var response = client.GetAsync(url).Result;
        if (response.IsSuccessStatusCode)
        {
          return GetData<T>(response);
        }

        return default(T);
      }
    }
  }
}
