using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Aris.API.Models
{
    public class Data
    {
        public List<Location> Locations { get; set; }
        public List<Supervisor> Supervisors { get; set; }
        public List<TeamLead> TeamLeads { get; set; }
    }
}