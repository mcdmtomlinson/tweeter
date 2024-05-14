const MAX_CHARS = 140;

$(() => {
  /**
   * function to initialize the character count for the text area,
   * listening for the input and updating the display.
   */
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