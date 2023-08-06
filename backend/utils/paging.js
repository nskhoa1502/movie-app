function paginate(movieList, page = 1, limit = 20) {
  // movieList sẽ là một array, dựa vào số thứ tự page và limit => slice movieList với thứ tự và số lượng tương ứng.
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Ví dụ: page = 3, limit = 20 => slice từ index 40 -> 59 (20 movies)
  const paginatedList = movieList.slice(startIndex, endIndex);

  // Làm tròn tổng số trang để có thể hiện hết phim (Ví dụ: tổng số phim là 46 => 3 trang)
  const totalPages = Math.ceil(movieList.length / limit);

  return {
    results: paginatedList,
    page: page,
    total_pages: totalPages,
  };
}

module.exports = paginate;
