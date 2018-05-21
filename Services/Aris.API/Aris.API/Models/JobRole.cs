using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Aris.API.Models
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

    public class JobItem2
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

    public class Link2
    {
        public string kind { get; set; }
        public string method { get; set; }
        public string href { get; set; }
        public string rel { get; set; }
    }

    public class Attribute2
    {
        public string kind { get; set; }
        public string id { get; set; }
        public string typename { get; set; }
        public int type { get; set; }
        public string apiname { get; set; }
        public string language { get; set; }
        public string value { get; set; }
    }

    public class Item3
    {
        public string kind { get; set; }
        public string guid { get; set; }
        public Link2 link { get; set; }
        public string typename { get; set; }
        public int type { get; set; }
        public int default_symbol { get; set; }
        public string apiname { get; set; }
        public List<Attribute2> attributes { get; set; }
        public string default_symbol_guid { get; set; }
    }

    public class Descendant
    {
        public string kind { get; set; }
        public Item3 item { get; set; }
        public List<object> descendants { get; set; }
    }

    public class JobItem
    {
        public string kind { get; set; }
        public JobItem2 item { get; set; }
        public List<Descendant> descendants { get; set; }
    }

    public class JobRole
    {
        public string kind { get; set; }
        public string request { get; set; }
        public string status { get; set; }
        public int item_count { get; set; }
        public List<JobItem> items { get; set; }
    }
}