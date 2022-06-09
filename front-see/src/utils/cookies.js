import Cookies from 'js-cookie';

// Create Params Cookie
export const setParamsCookie = (themeMode) => {
    Cookies.remove("seeparams");
    Cookies.set(
        "seeparams",
        {
            themeMode: themeMode
        },
        { expires: 1 }
    );
};

// Return Params cookie in JSON
export const getParamsCookie = () => {
    const paramsCookie = Cookies.get("seeparams");

    if (paramsCookie === undefined) {
        return {};
    } else {
        return JSON.parse(paramsCookie);
    }
};

// Create User Cookie
export const setUserCookie = (userID, username, typeUserID, name, firstName, birthDate, mailAdress, creationDate, lastConnexionDate, token) => {
    Cookies.remove("seeuser");
    Cookies.set(
        "seeuser",
        {
            userID: userID,
            username: username,
            typeUserID: typeUserID,
            name: name,
            firstName: firstName,
            birthDate: birthDate,
            mailAdress: mailAdress,
            creationDate: creationDate,
            lastConnexionDate: lastConnexionDate,
            token: token
        },
        { expires: 1 }
    );
};

// Return User cookie in JSON
export const getUserCookie = () => {
    const userCookie = Cookies.get("seeuser");

    if (userCookie === undefined) {
        return {};
    } else {
        return JSON.parse(userCookie);
    }
};

// Remove the session cookie
export const disconnectUser = () => {
    Cookies.remove("seeuser");
}