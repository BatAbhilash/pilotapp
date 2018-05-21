using System.Collections.Generic;
using System.Reflection;

namespace Aris.API.Helpers
{
    /// <summary>
    /// A helper related to all the colors
    /// </summary>
    public static class ColorHelper
    {
        /// <summary>
        /// Gets all the knows colors in the system.
        /// </summary>
        /// <param name="hasKnownColors">Flag if the known system colors are to be fetched</param>
        /// <returns></returns>
        public static List<string> GetColors(bool hasKnownColors = false)
        {
            var colorList = new List<string>();

            if (hasKnownColors)
            {
                var colorType = typeof(System.Drawing.Color);

                // We take only static property to avoid properties like Name, IsSystemColor ...
                var propInfos = colorType.GetProperties(BindingFlags.Static | BindingFlags.DeclaredOnly | BindingFlags.Public);

                foreach (PropertyInfo propInfo in propInfos)
                {
                    colorList.Add(propInfo.Name);
                }
            }
            else
            {
                colorList = new List<string> {
                                               "#ef9a9a",
                                               "#f06292",
                                               "#ce93d8",
                                               "#9575cd",
                                               "#9fa8da",
                                               "#90caf9",
                                               "#81d4fa",
                                               "#4db6ac",
                                               "#66bb6a",
                                               "#aed581",
                                               "#fbc02d",
                                               "#ff6f00",
                                               "#795548",
                                               "#bdbdbd",
                                               "#cfd8dc"

                                               /*"#d0d1d5",
                                               "#cbf9e5",
                                               "#dfdfe6",
                                               "#c3f2e5",
                                               "#e1e6e8",
                                               "#beeff0",
                                               "#cdcbd1",
                                               "#cae4fb",
                                               "#b8bcc8",
                                               "#c8e1f0"*/

                                               //"#cbf9e5",
                                               //"#c3f2e5",
                                               //"#beeff0",
                                               //"#cae4fb",
                                               //"#c8e1f0"
                                             };
            }
            

            return colorList;
        }
    }
}