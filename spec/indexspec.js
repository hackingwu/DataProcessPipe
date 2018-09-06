describe("DataProcessPipe", function(){
  const DataProcessPipe = require("../index.js");
  describe("test list data", function(){
    it("sub array", function(){
      let data = [1, 2, 3]
      let value = DataProcessPipe.process("[1, -1]", data);
      expect(value).toEqual([2, 3]);
    })

    it("map get value", function(){
      let data = {"key1": {"key2": {"key3": "value"}}}
      let value = DataProcessPipe.process(".key1.key2.key3", data);
      expect(value).toEqual("value");
    })

    it("ts2date", function(){
      let data = {"ts": "1536220630383"}
      let value = DataProcessPipe.process(";{ts: ts2date YYYYMMDD}", data);
      expect(value).toEqual({"ts": "20180906"});
      data = [{"ts": "1536220630383"}, {"ts": "1536220630383"}]
      value = DataProcessPipe.process("{ts: ts2date YYYYMMDD}", data);
      expect(value).toEqual([{"ts": "20180906"}, {"ts": "20180906"}])
    })
  })
})