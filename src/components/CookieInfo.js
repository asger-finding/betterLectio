export async function cookieInfo() {
  if (
    !localStorage.getItem("lectio-cookie") &&
    window.location.href.split("?")[0].split("/").at(-1) != "auth" &&
    window.location.href.split("?")[0].split("/").at(-1) != ""
  ) {
    console.log("Redirect");
    const transformedLink = window.location.href.split("/")[3].replace("/", "%3").replace("?", "%3F").replace("=", "%3d").replace(`"`, "%22")
    window.location.href = "/auth?redirect=" + transformedLink;
  } else {
    let decodedCookie = window.atob(localStorage.getItem("lectio-cookie"));
    let cookie = JSON.parse(decodedCookie);
    let userDict = {
      user: "",
      school: "",
      userid: "",
    };
    cookie.forEach((_cookie) => {
      if (_cookie.name == "LastLoginUserName") {
        userDict.user = _cookie.value;
      } else if (_cookie.name == "LastLoginExamno") {
        userDict.school = _cookie.value;
      } else if (_cookie.name == "LastLoginElevId") {
        userDict.userid = _cookie.value;
      }
    });
    return userDict;
  }
}
