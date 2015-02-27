
// Code to execute after the DOM is ready
$(function () {

  var $mainContainer = $('.container');
  
  // getBoards('../api/my_boards.json', $mainContainer);
  // getBoards('../api/random.json', $mainContainer);
  // getBoards('../api/get_the_app.json', $mainContainer);
  
  // getBoards('http://www.reddit.com/r/pimpcats.json', $mainContainer);
  getBoards('http://www.reddit.com/r/EarthPorn.json', $mainContainer);
  // getBoards('http://www.reddit.com/r/pics.json', $mainContainer);

  // $().click();
  // $().click();
  // $().click();

});

function getBoards (dataLocation, containingEl) {
  $.getJSON(dataLocation, function (resData) {
    var resultsCollection = resData.data.children;
    var postsCollection = [];
    $.each(resultsCollection, function (idx, child) {
      var boardPost = new BoardPost(child.data);
      postsCollection.push(boardPost);
    });
    renderPanelGrid(containingEl, postsCollection);
  });
}

function BoardPost (dataObj) {
  this.image = dataObj.url;
  this.title = dataObj.title;
  this.author = 'by ' + dataObj.author;
  this.age = postedAgoString(dataObj.created) + ' ago';
  this.views = dataObj.score + ' views';
}

function scrubImageLink (imageUrl) {
  var extRE = /(png|jpg|gif)$/;
  var gifvRE = /gifv$/;
  var imgurRE = /imgur/;
  if (imgurRE.test(imageUrl) && !(extRE).test(imageUrl)) {
    return imageUrl + '.png';
    // This works but runs too slow
    // if (!gifvRE.test(imageUrl)) {
    //   return imageUrl + '.png';
    // } else {
    //   return imageUrl.replace(gifvRE, 'gif');
    // }
  }
  return imageUrl;
}

function postedAgoString (created) {
  return moment.duration(moment.unix(created)).humanize();
}

function renderPanelGrid ($containerEl, collection) {
  var $assembledGrid = $('<div>', { 'class': "grid grid-gutter" });

  $.each(collection, function (idx, panel) {
    assemblePanel($assembledGrid, panel);
  });

  $containerEl.append($assembledGrid);
}

function assemblePanel ($gridEl, panelData) {
  var $assembledPanel = $('<div>', { 'class': "col-1-2"});
  var $panel = $('<div>', { 'class': "panel"});
  var $image = $('<div>', { 'class': "image"});
  $image.css('background-image', "url('" + scrubImageLink(panelData.image) + "')");
  var $title = $('<h2>', { html: panelData.title });
  var $panelDetails = $('<div>', { 'class': "panel-details"});
  var $author = $('<span>', { 'class': "panel-by", html: panelData.author });
  var $postedAgo = $('<span>', { 'class': "panel-posted-date", html: panelData.age });
  var $views = $('<span>', { 'class': "panel-views", html: panelData.views });
  var $contents = $('<p>');

  $contents.BaconIpsum({ type:'meat-and-filler', start_with_lorem:false, sentences:2, no_tags: true });
  
  $panelDetails.append($author)
    .append($postedAgo)
    .append($views);

  $panel.append($image)
    .append($title)
    .append($panelDetails)
    .append($contents);
  
  $assembledPanel.append($panel);

  $assembledPanel.appendTo($gridEl);
}
