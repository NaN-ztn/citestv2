/**
 * 发布上线后需要做3件事：
 * 1. 发布记录落多维表格
 * 2. 飞书群通知
 * 3. 云函数创建新版本并且切换100%流量
 */

const repoInfo = require('./repo_info.js')
const axios = require('axios')

// 命令行的入参
const [operator] = process.argv.slice(2)

// let FEISHU_TOKEN = null

// /**
//  * 从全局变量中获取，有就直接返回，没有则请求，确保一次生命周期中只请求一次
//  * @returns 飞书Token
//  */
// async function getFeiShuToken() {
//   if (!FEISHU_TOKEN) {
//     const r = await request({
//       method: 'POST',
//       uri: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
//       json: true,
//       body: {
//         app_id: 'cli_a208f45746f8100b',
//         app_secret: 'WmJ7MrvIQuCHIwNCBjzUogZKLbHRDl1Q',
//       },
//     })
//     if (r.code !== 0) {
//       throw new Error(r.msg)
//     }
//     FEISHU_TOKEN = r.tenant_access_token
//   }
//   return FEISHU_TOKEN
// }

/**
 * 飞书文档 + 飞书通知
 */
async function feishuNotify() {
  // const [tableid, objtoken] = ['tblueoCtP2oUphNN', 'bascnYdu7oAJZ1Rg0f42pondjZg']
  // const accessToken = await getFeiShuToken()
  const { gitCommitHash, gitCommitName } = await repoInfo()
  const publishMsg = {
    操作人: operator,
    'git-commit': gitCommitHash,
    'git-message': gitCommitName,
    时间: new Date().getTime(),
  }

  const promiseList = []

  // 飞书文档写记录
  // promiseList.push(
  //   request({
  //     method: 'POST',
  //     uri: `https://open.feishu.cn/open-apis/bitable/v1/apps/${objtoken}/tables/${tableid}/records`,
  //     json: true,
  //     headers: {
  //       Authorization: 'Bearer ' + accessToken,
  //       'Content-Type': 'application/json; charset=utf-8',
  //     },
  //     body: {
  //       fields: publishMsg,
  //     },
  //   })
  // )

  delete publishMsg['时间']

  // 飞书群通知
  promiseList.push(
    axios({
      method: 'post',
      url: 'https://open.feishu.cn/open-apis/bot/v2/hook/84f4d336-04c7-40ef-8f82-9d898e9e1b3c',
      responseType: 'json',
      data: {
        msg_type: 'interactive',
        card: {
          config: { wide_screen_mode: true, enable_forward: true },
          elements: [
            {
              tag: 'div',
              text: { content: JSON.stringify(publishMsg), tag: 'lark_md' },
            },
          ],
          header: {
            title: { content: 'web后台上线通知', tag: 'plain_text' },
          },
        },
      },
    })
  )

  const res = await Promise.allSettled(promiseList)

  console.info('飞书文档和群消息:' + JSON.stringify(res))
}

// 文件入口
;(async () => {
  feishuNotify()
})()
