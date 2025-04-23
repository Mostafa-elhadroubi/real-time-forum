import { setError } from "./home.js";
import { navigateTo } from "./main.js";

export const logout = (app) => {
    fetch("/logout")
    .then(res => {
        if(!res.ok){
            let obj =  res.json()
            setError(obj.Message)  
            return;
        }
       navigateTo("/login")
    })
    .catch(error => {
        console.log('Error: ', error)
    })
}