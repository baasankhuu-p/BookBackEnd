module.exports = async function(page, limit, model) {
    const total = await model.countDocuments();
    const pageCount = Math.ceil(total/limit);
    const start = (page-1)*limit+1;
    let end = start+limit-1;
    if(end > total) end=total;
    const pagenation = {
        total,
        pageCount,
        start,
        end,
        limit
    }
    if(page < pageCount) pagenation.nextPage = page+1;
    if(page > 1) pagenation.prevPage = page-1;
        return pagenation;
}