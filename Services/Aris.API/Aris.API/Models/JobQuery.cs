using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Aris.API.Models
{
    public class Item2
    {
        public string type { get; set; }
        public string typenum { get; set; }
        public string function { get; set; }
    }

    public class Item
    {
        public string type { get; set; }
        public string direction { get; set; }
        public List<Item2> items { get; set; }
    }

    public class JobQuery
    {
        public string start_guids { get; set; }
        public List<Item> items { get; set; }

        public static string JobQueryData()
        {
            var jobQuery = new JobQuery
            {
                start_guids = "34b189b1-3728-11e8-68dc-0a02fcef0a7a",
                items = new List<Item>()
            };
            jobQuery.items.Add(new Item { type = "CONNECTION", direction = "OUT" });
            jobQuery.items[0].items = new List<Item2>
            {
                new Item2 { type = "OBJECT", typenum = "78,44", function = "TARGET" }
            };

            var jsonPost = JsonConvert.SerializeObject(jobQuery);
            return jsonPost;
        }
    }
}