enum Status{
	SUCCESS,
    USER_PERMISSIONS_ERROR,
    BOT_PERMISSIONS_ERROR,
    DEV_ONLY_ERROR,
    COOLDOWN_ERROR,
    API_ERROR,
    CUSTOM_ERROR,
    UNEXPECTED_ERROR
}

export class CommandResponse{
	status: keyof typeof Status;
	response: string;
	constructor(status?: keyof typeof Status, response?: string){
		this.status = status ?? "SUCCESS";
		this.response =  response ?? "Command ran successfully.";
	}
}