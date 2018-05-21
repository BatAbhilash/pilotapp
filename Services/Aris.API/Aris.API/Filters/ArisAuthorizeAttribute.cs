using System;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace Aris.API.Filters
{
    public sealed class ArisAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(HttpActionContext filterContext)
        {
            if (Authorize(filterContext))
            {
                return;
            }

            HandleUnauthorizedRequest(filterContext);
        }

        protected override void HandleUnauthorizedRequest(HttpActionContext filterContext)
        {
            base.HandleUnauthorizedRequest(filterContext);
        }

        private bool Authorize(HttpActionContext actionContext)
        {
            try
            {
                //var identity = Microsoft.AspNet.Identity.Owin.
                //var token = string.Empty;
                //var cookie = "";// actionContext.Request.Headers.GetCookies("TokenCookie").FirstOrDefault();
                //if (cookie != null)
                //{
                //    token = cookie.Cookies[0].Value;
                //}

                //return !string.IsNullOrEmpty(token);
                return false;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}