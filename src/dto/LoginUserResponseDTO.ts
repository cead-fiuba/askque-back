/** 
 * 
 * Esta clase es la API response cuando el usuario logra logearse
*/
export class LoginUserResponseDTO {

    token: string

    email: string

    is_teacher: boolean

    constructor(token: string, email: string, is_teacher: boolean) {
        this.token = token;
        this.email = email;
        this.is_teacher = is_teacher;
    }

}