(function() {
  /* Tag filtering via sidebar checkboxes */
  var checkboxes = document.querySelectorAll('.sidebar-filter__check');
  var rows = document.querySelectorAll('#post-cards .post-row');

  checkboxes.forEach(function(cb) {
    cb.addEventListener('change', filterPosts);
  });

  function filterPosts() {
    var selected = [];
    checkboxes.forEach(function(cb) {
      if (cb.checked) selected.push(cb.getAttribute('data-tag'));
    });

    rows.forEach(function(row) {
      if (selected.length === 0) {
        row.style.display = '';
      } else {
        var rowTags = row.getAttribute('data-tags').split(',');
        var match = selected.some(function(tag) {
          return rowTags.indexOf(tag) !== -1;
        });
        row.style.display = match ? '' : 'none';
      }
    });
  }

  /* Topic toggle */
  var toggle = document.getElementById('topic-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      this.closest('.sidebar-group').classList.toggle('collapsed');
    });
  }

  /* Search */
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var browseSection = document.getElementById('browse-section');
  var searchData = null;

  if (!searchInput) return;

  searchInput.addEventListener('input', function() {
    var query = this.value.trim().toLowerCase();
    if (query.length < 2) {
      searchResults.style.display = 'none';
      browseSection.style.display = '';
      return;
    }

    if (!searchData) {
      fetch('/search.json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          searchData = data;
          performSearch(query);
        });
    } else {
      performSearch(query);
    }
  });

  function performSearch(query) {
    var results = searchData.filter(function(post) {
      return post.title.toLowerCase().indexOf(query) !== -1 ||
             post.excerpt.toLowerCase().indexOf(query) !== -1 ||
             post.tags.some(function(t) { return t.toLowerCase().indexOf(query) !== -1; });
    });

    browseSection.style.display = 'none';
    searchResults.style.display = '';

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-empty">No articles found for \u201c' + query + '\u201d</p>';
      return;
    }

    var html = results.map(function(post) {
      return '<a href="' + post.url + '" class="post-row">' +
        '<span class="post-row__date">' + post.date + '</span>' +
        '<span class="post-row__title">' + post.title + '</span>' +
        '</a>';
    }).join('');

    searchResults.innerHTML = html;
  }
})();
