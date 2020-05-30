$(() => {
    $(".delquote").on("click", function(event){
        const id = $(this).data("id");

        $.ajax(`/api/quotes/${id}`, {
            type: "DELETE"
        }).then(
            function(){
                console.log(`deleted id ${id}`);
                location.reload()
            }
        );
    });
    $(".create-form").on("submit", function(event){
        event.preventDefault();

        const newQuote = {
            author: $("#auth").val().trim(),
            quote: $("#quo").val().trim()
        };

        $.ajax("/api/quotes", {
            type: "POST",
            data: newQuote
        }).then(
            function(){
                console.log("created new quote");
                location.reload();
            }
        )
    })
    $(".update-form").on("submit", function(event){
        event.preventDefault();
        const updatedQuote = {
            author: $("#auth").val().trim(),
            quote: $("#quo").val().trim()
        }
        const id = $(this).data("id");
        $.ajax(`/api/quotes/${id}`, {
            type: "PUT",
            data: updatedQuote
        }).then(
            () => {
                console.log('updated quote')
                location.assign('/')
            }
        )
    })
})