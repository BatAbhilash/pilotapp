using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Aris.API.Models.JobHelper
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

    public class JobMapper
    {
        public string kind { get; set; }
        public string request { get; set; }
        public string status { get; set; }
        public int item_count { get; set; }
    public string next_pagetoken { get; set; }
    public List<Item> items { get; set; }
    }
}
