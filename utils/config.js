// 为了降低 request函数和服务器域名的一个耦合度我们在这里单独创建一个文件来存储相关的服务器域名，方便后期维护
export default {
  host: 'http://localhost:3000',
  test: 'http://10.17.24.248:3000'
}