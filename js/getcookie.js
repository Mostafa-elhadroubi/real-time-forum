export const getCookie = () => {
    const decodedCookie = decodeURIComponent(document.cookie)
    let arrCookie = decodedCookie.split(';');
    for(let i = 0; i < arrCookie.length; i++) {
        let cookieKey = arrCookie[i].split('=')[0]
        let cookieValue = arrCookie[i].split('=')[1]
        if( cookieKey.trim() == 'errors') {
            return cookieValue.trim().replace(/[\"]/g, "")
        }
    }
    return ""
}