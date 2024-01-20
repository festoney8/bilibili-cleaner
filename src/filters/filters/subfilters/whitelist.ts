// import { debug, error } from '../../../utils/logger'

// class WhitelistFilter implements ISubFilter {
//     private isEnable = false
//     private whitelistKeywordSet = new Set<string>()
//     private whitelistUploaderSet = new Set<string>()

//     setStatus(status: boolean) {
//         this.isEnable = status
//     }

//     setParams(whitelistList: string[]) {
//         this.whitelistSet = new Set(whitelistList)
//     }

//     addParam(whitelist: string) {
//         if (whitelist.trim()) {
//             this.whitelistSet.add(whitelist.trim())
//         }
//     }

//     check(title: string): Promise<void> {
//         title = title.trim()
//         return new Promise<void>((resolve, reject) => {
//             try {
//                 if (!this.isEnable || title.length === 0 || this.whitelistSet.size === 0) {
//                     debug('resolve, WhitelistFilter disable, or title invalid, or wordlist empty')
//                     resolve()
//                 }
//                 // 快速判断
//                 if (this.whitelistSet.has(title)) {
//                     debug(`reject, title ${title} in whitelist list`)
//                     reject()
//                 }
//                 this.whitelistSet.forEach((word) => {
//                     if (word && title.includes(word)) {
//                         debug(`reject, title ${title} in whitelist list`)
//                         reject()
//                     }
//                 })
//                 debug(`resolve, title ${title} not in whitelist list`)
//                 resolve()
//             } catch (err) {
//                 error(err)
//                 error(`resolve, WhitelistFilter error, title`, title)
//                 resolve()
//             }
//         })
//     }
//     checkUploader(uploader: string): Promise<void> {
//         uploader = uploader.trim()
//         return new Promise<void>((resolve, reject) => {
//             try {
//                 if (!this.isEnable || uploader.length === 0 || this.uploaderSet.size === 0) {
//                     debug('resolve, UploaderFilter disable, or uploader invalid, or uploader list empty')
//                     resolve()
//                 }
//                 if (this.uploaderSet.has(uploader)) {
//                     debug(`reject, uploader ${uploader} in uploader list`)
//                     reject()
//                 }
//                 debug(`resolve, uploader ${uploader} not in uploader list`)
//                 resolve()
//             } catch (err) {
//                 error(err)
//                 error(`resolve, UploaderFilter error, uploader`, uploader)
//                 resolve()
//             }
//         })
//     }
// }

// // 单例
// const whitelistFilterInstance = new WhitelistFilter()
// export default whitelistFilterInstance
