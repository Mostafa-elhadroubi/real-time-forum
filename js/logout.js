import { navigateTo } from "./main.js";

export const logout = (app) => {
    fetch("/logout")
    .then(res => {
        if(!res.ok){
            const errorHTML =  res.text();
            document.body.innerHTML = errorHTML;
            return;
        }
       navigateTo("/login")
    })
    .catch(error => {
        console.log('Error: ', error)
    })
}