import avro from 'avsc';

export default avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'sno',
      type: 'int'
    },
    {
      name: 'title',
      type: 'string',
    }
  ]
});
