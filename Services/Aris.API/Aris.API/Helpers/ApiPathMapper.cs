using System.Collections.Generic;
using System.Xml.Serialization;

namespace Aris.API.Helpers
{

    [XmlRoot(ElementName = "methodfilters")]
    public class Methodfilters
    {
        [XmlElement(ElementName = "methodfilter")]
        public string Methodfilter { get; set; }
    }

    [XmlRoot(ElementName = "attributes")]
    public class Attributes
    {
        [XmlElement(ElementName = "attribute")]
        public List<string> Attribute { get; set; }
    }

    [XmlRoot(ElementName = "attributeFilters")]
    public class AttributeFilters
    {
        [XmlElement(ElementName = "filter")]
        public string Filter { get; set; }
    }

    [XmlRoot(ElementName = "typeFilters")]
    public class TypeFilters
    {
        [XmlElement(ElementName = "filter")]
        public string Filter { get; set; }
    }

    [XmlRoot(ElementName = "root")]
    public class Root
    {
        [XmlElement(ElementName = "kind")]
        public string Kind { get; set; }
        [XmlElement(ElementName = "methodfilters")]
        public Methodfilters Methodfilters { get; set; }
        [XmlElement(ElementName = "attributes")]
        public Attributes Attributes { get; set; }
        [XmlElement(ElementName = "attributeFilters")]
        public AttributeFilters AttributeFilters { get; set; }
        [XmlElement(ElementName = "typeFilters")]
        public TypeFilters TypeFilters { get; set; }
    }

}
