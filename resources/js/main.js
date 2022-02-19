
window.myApp = {
    openDocs: () => {
        Neutralino.os.open('https://github.com/baxttter/baxtersessentialcolourtools');
    },
    openFile: () => {
        $("main").css("opacity", "0.3");

        // i need this to load the image
        let entries = await Neutralino.os.showOpenDialog("Please Select an Image", {
            filters: [
                {name: 'Images', extensions: ['jpg', 'png']}
            ]       
        });
        $("#image-box").text(entries[0]);

    }
};
Neutralino.init();