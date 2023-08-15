let dayjs = require('dayjs')
let columns = [
  {
    title: 'WBS122',
    id: 1,
    startTime: dayjs().add(-1, 'year'),
    endTime: dayjs(),
    author: 'Alex',
    percent: 40,
    children: [
      {
        title: 'WBS11',
        id: 11,
        startTime: dayjs(),
        endTime: dayjs().add(1, 'days'),
        author: 'Alex',
        percent: 40
      },
      {
        title: 'WBS12',
        id: 12,
        startTime: dayjs(),
        endTime: dayjs().add(1, 'months'),
        author: 'Alex',
        percent: 40
      }
    ]
  },
  {
    title: 'WBS2',
    id: 2,
    startTime: dayjs(),
    endTime: dayjs().add(1, 'months'),
    author: 'Alex',
    percent: 40,
    children: [
      {
        title: 'WBS11',
        id: 21,
        startTime: dayjs(),
        endTime: dayjs().add(1, 'days'),
        author: 'Alex',
        percent: 40
      },
      {
        title: 'WBS12',
        id: 22,
        startTime: dayjs(),
        endTime: dayjs().add(1, 'months'),
        author: 'Alex',
        percent: 40
      }
    ]
  },
  {
    title: 'WBS3',
    id: 3,
    startTime: dayjs(),
    endTime: dayjs().add(1, 'months'),
    author: 'Alex',
    percent: 40,
    children: [
      {
        title: 'WBS11',
        id: 31,
        startTime: dayjs(),
        endTime: dayjs().add(1, 'days'),
        author: 'Alex',
        percent: 40,
        children: [
          {
            title: 'WBS11',
            id: 311,
            startTime: dayjs(),
            endTime: dayjs().add(1, 'days'),
            author: 'Alex',
            percent: 40
          }
        ]
      },
      {
        title: 'WBS12',
        id: 32,
        startTime: dayjs(),
        endTime: dayjs().add(1, 'months'),
        author: 'Alex',
        percent: 40
      }
    ]
  }
]

let deepColumns = []
function getDeepColumns (columns, deep) {
  deep = deep ? deep : 0

  let _columns = columns.map(c => {
    if (c.children && c.children.length > 0) {
      getDeepColumns(c.children, deep + 1)
    }
    c.deep = deep + 1

    return c
  }).sort((a, b) => {
    return a.deep - b.deep
  })
  deepColumns = deepColumns.concat(_columns)
  return _columns
}
getDeepColumns(columns)

deepColumns = deepColumns.sort((a, b) => {
  return a.deep - b.deep
})
console.log(deepColumns)



// console.log(JSON.stringify(columns))