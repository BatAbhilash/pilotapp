using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Aris.API.Models
{
    public class Supervisor
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; } = "white";
        //public string LocationId { get; set; }
        //public string LocationName { get; set; }
        //public List<TeamLead> TeamLeads { get; set; }
    }
}