using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace JSONConverter
{
    /// <summary>
    /// ToJSON() extension methods are defined for type "Object" 
    ///  which means they can be used with all objects in .NET (not just collections). 
    /// </summary>
   
        public static class JSONHelper
        {
            public static string ToJSON(this object obj)
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                return serializer.Serialize(obj);
            }

            public static string ToJSON(this object obj, int recursionDepth)
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                serializer.RecursionLimit = recursionDepth;
                return serializer.Serialize(obj);
            }
        }
    
}