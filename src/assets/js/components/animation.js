const paths = document.querySelectorAll('path');

for (let i = 0; i < paths.length; i++) {
	console.log(`Lenght ${i + 1} is ${Math.ceil(paths[i].getTotalLength())}`);

}

