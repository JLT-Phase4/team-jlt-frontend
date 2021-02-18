export const fakeUsers = [
  {
    userPk: '1',
    username: 'jessicarabbit',
    avatarUrl: 'https://images.unsplash.com/photo-1532202802379-df93d543bac3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1268&q=80',
    chores: [{ name: 'laundry', complete: true, type: 'weekly' },
      { name: 'brush teeth', complete: true, type: 'daily' },
      { name: 'dishes', complete: false, type: 'daily' }]
  },
  {
    userPk: '2',
    username: 'elmerfudd',
    avatarUrl: 'https://images.unsplash.com/photo-1533518463841-d62e1fc91373?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80',
    chores: [{ name: 'trash', complete: true, type: 'weekly' },
      { name: 'brush teeth', complete: true, type: 'daily' },
      { name: 'vacuum', complete: false, type: 'weekly' }]
  },
  {
    userPk: '3',
    username: 'bettyboop',
    avatarUrl: 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
    chores: [{ name: 'make bed', complete: true, type: 'daily' },
      { name: 'mow lawn', complete: true, type: 'weekly' },
      { name: 'floss', complete: false, type: 'daily' }]
  }
]

export default fakeUsers
