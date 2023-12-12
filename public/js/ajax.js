$.ajax({
    type: 'GET',
    url: "http://localhost:3000/items",
    async: true,
    success: (data) => {
        console.log('table loaded')
    }, error: (jqXHR, text, err) => {

    }
})