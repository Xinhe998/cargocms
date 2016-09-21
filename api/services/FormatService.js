module.exports = {
  getQueryObj: (input) => {
    try {
      sails.log.debug(data);
      let data = {
        where: {},
      };
      data.where.$or = [];
      for (const index in input.columns) {
        let result = {};
        const column = input.columns[index];
        if (column.searchable !== "false") {
          result[column.data] = {
            $like: `%${input.search.value}%`
          };
          data.where.$or.push(result);
        }
      }
      data.offset = parseInt(input.start);
      data.limit = parseInt(input.length);
      data.order = input.order.map((data) => {
        let columnIndex = data.column;
        let sortColumn = input.columns[columnIndex].data;
        return [sortColumn, data.dir];
      });
      return data;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },
}
