const MAX_CHARS = 140;

$(() => {
  $(".tweet-text").on("input" , function() {
    let remainingChars = MAX_CHARS - $(this).val().length;
    const counterElement = $(this).closest('form').find('.counter')[0];
    counterElement.innerHTML = remainingChars;
    if (remainingChars < 0) {
      $(counterElement).addClass("counter-red");
    } else {
      $(counterElement).removeClass("counter-red");
    }
  });
});