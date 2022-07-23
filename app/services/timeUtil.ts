export const millisToMin = (millis: number) => {
	var minutes = Math.floor(millis / 60000);
	var seconds = Math.round((millis % 60000) / 1000)
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const secondsToMin = (seconds: number) => {
	var minutes = Math.floor(seconds / 60);
	var seconds = Math.round(seconds % 60)
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
