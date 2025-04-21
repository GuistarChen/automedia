import { chromium as browserCore } from "playwright";
import dayjs from "dayjs";
import axios from "axios";
const e = process.platform;
let o;
function sleep(delay) {
  return new Promise((timer) => setTimeout(timer, delay));
}
function fetchCreatorUserInfo(cookie) {
  return new Promise((callback, handleError) => {
    fetch("https://creator.douyin.com/aweme/v1/creator/user/info/", {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
        "Content-Type": "application/json",
        Cookie: cookie,
        Referer: "https://creator.douyin.com/",
      },
    })
      .then((fetchJson) => fetchJson.json())
      .then((callback2) => callback(callback2))
      .catch((e) => handleError(e));
  });
}
async function publishVideo(options) {
  let browser6;
  let browserContext3;
  let executablePath2 = options.executablePath;
  let show = options.show;
  let videoPath3 = options.videoPath;
  let cookies5 = options.cookies;
  let projectTitle = options.title || "";
  let topics3 = options.topics || [];
  let coverImage3 = options.cover || "";
  let $location3 = options.location || "";
  let sendTime3 = options.sendTime;
  let isTimed2 = options.isTiming;
  let url3 = options.url;
  let libsPath3 = options.libsPath;
  try {
    const browserOptions = {
      headless: show,
      executablePath: executablePath2,
    };
    const browserConfig2 = {
      storageState: cookies5,
      userAgent: o,
    };
    const scriptPath = {
      path: libsPath3,
    };
    browser6 = await browserCore.launch(browserOptions);
    browserContext3 = await browser6.newContext(browserConfig2);
    browserContext3.addInitScript(scriptPath);
    const newPage = await browserContext3.newPage();
    const buttonName = {
      name: "发布视频",
    };
    await newPage.goto(url3);
    await sleep(1000);
    await newPage.click("text=发布视频");
    await newPage
      .locator("xpath=//*[contains(@class, 'container-drag-icon')]")
      .click();
    await newPage
      .locator('xpath=//*[contains(@class, "container-drag")]//input')
      .setInputFiles(videoPath3);
    await sleep(5000);
    await newPage.getByPlaceholder("填写作品标题，为作品获得更多流量").click();
    await sleep(1000);
    await newPage
      .getByPlaceholder("填写作品标题，为作品获得更多流量")
      .fill(projectTitle);
    await newPage.locator(".zone-container").click();
    await sleep(1000);
    for (let topic of topics3) {
      await newPage.keyboard.type("#" + topic);
      await newPage.keyboard.press("Enter");
      await sleep(1000);
    }
    if ($location3) {
      try {
        await newPage.getByText("输入地理位置").click();
        await sleep(1000);
        await newPage
          .locator(
            'xpath=//*[@id="douyin_creator_pc_anchor_jump"]//div[contains(@class, "semi-input-wrapper")]//input'
          )
          .fill($location3);
        await sleep(5000);
        await newPage
          .locator("xpath=//*[contains(@class, 'detail-v2')]")
          .first()
          .click();
      } catch (e) {}
    }
    await sleep(1000);
    if (coverImage3) {
      try {
        const buttonLabel = {
          name: "完成",
        };
        await newPage
          .locator(
            'xpath=//*[contains(@class, "filter")]//*[contains(@class, "semi-icons-image")]'
          )
          .first()
          .click();
        await sleep(500);
        await newPage
          .locator('xpath=//*[contains(@class, "imageUploader")]')
          .click();
        await sleep(500);
        await newPage
          .locator("xpath=//*[contains(@class, 'semi-upload')]//input[1]")
          .setInputFiles(coverImage3);
        await sleep(4000);
        await newPage.getByRole("button", buttonLabel).click();
        await sleep(1000);
      } catch (e) {
        try {
          await newPage
            .locator(
              "xpath=//*[contains(@class, 'semi-modal-body')]//*[contains(@class, 'close-')]"
            )
            .click();
          await sleep(1000);
        } catch (e) {}
      }
    }
    if (isTimed2) {
      try {
        await newPage
          .locator("label")
          .filter({
            hasText: "定时发布",
          })
          .click();
        await sleep(1000);
        await newPage.getByPlaceholder("日期和时间").click();
        let formattedTime2 = dayjs
          .unix(sendTime3)
          .format("YYYY-MM-DD HH:mm:ss");
        let formattedDate2 = dayjs(formattedTime2).format("YYYY-MM-DD");
        let hour = dayjs(formattedTime2).format("HH");
        let minutes = dayjs(formattedTime2).format("mm");
        let currentTime3 = dayjs().format("YYYY-MM-DD HH:mm:ss");
        if (formattedDate2.split("-")[1] > currentTime3.split("-")[1]) {
          await newPage
            .locator("xpath=//*[contains(@class, 'semi-icons-chevron_right')]")
            .click();
        }
        await sleep(200);
        await newPage.getByTitle(formattedDate2).locator("div").click();
        await sleep(200);
        await newPage
          .locator("xpath=//*[contains(@class, 'semi-datepicker-switch-time')]")
          .click();
        await sleep(500);
        let hourSelector = await newPage
          .locator(
            "xpath=//*[contains(@class, 'list-hour')]//*[contains(@class, 'semi-scrolllist-list-outer')]/ul/li[contains(text(), '" +
              hour +
              "')]"
          )
          .first();
        await hourSelector.click();
        await sleep(200);
        hourSelector = await newPage
          .locator(
            "xpath=//*[contains(@class, 'list-minute')]//*[contains(@class, 'semi-scrolllist-list-outer')]/ul/li[contains(text(), '" +
              minutes +
              "')]"
          )
          .first();
        await hourSelector.click();
        await sleep(1000);
      } catch (e) {}
    }
    await sleep(5000);
    let launchBrowser2 = [1, 2, 3];
    for (let browser23 of launchBrowser2) {
      try {
        const buttonConfig = {
          name: "发布",
          exact: true,
        };
        await newPage.getByRole("button", buttonConfig).click();
        await sleep(5000);
      } catch (e) {}
      if (
        newPage
          .url()
          .includes("https://creator.douyin.com/creator-micro/content/manage")
      ) {
        return {
          code: 200,
          msg: "发布成功",
        };
      }
      await sleep(1000);
    }
    const launchBrowser3 = {
      code: 500,
      msg: "dy发布失败",
    };
    return launchBrowser3;
  } catch (e) {
    const errorResponse = {
      code: 500,
      msg: e,
    };
    return errorResponse;
  } finally {
    if (browserContext3) {
      await browserContext3.close();
    }
    if (browser6) {
      await browser6.close();
    }
  }
}
async function retrieveValidCookies(getCookies) {
  let browser17;
  let context3;
  let executablePath4 = getCookies.executablePath;
  let cookieUrl = getCookies.url;
  let libsPath6 = getCookies.libsPath;
  try {
    let isRunning2 = true;
    let cookieCount2 = 1;
    const browserOptions3 = {
      headless: false,
      executablePath: executablePath4,
    };
    const scriptPath3 = {
      path: libsPath6,
    };
    browser17 = await browserCore.launch(browserOptions3);
    context3 = await browser17.newContext();
    context3.addInitScript(scriptPath3);
    const page5 = await context3.newPage();
    for (
      await page5.goto(cookieUrl),
        page5.on("close", async () => {
          isRunning2 = false;
        });
      isRunning2;

    ) {
      await sleep(1000);
      cookieCount2++;
      const cookies8 = await context3.cookies();
      if (cookies8) {
        const cookieString2 = cookies8
          .map((param) => param.name + "=" + param.value)
          .join("; ");
        let userData;
        try {
          userData = await fetchCreatorUserInfo(cookieString2);
          if (userData.user_profile) {
            isRunning2 = false;
            return await context3.storageState();
          }
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  } catch (e) {
    return [];
  } finally {
    if (context3) {
      await context3.close();
    }
    if (browser17) {
      await browser17.close();
    }
  }
}
o =
  "win32" === e
    ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    : "darwin" === e
    ? "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36"
    : "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Mobile Safari/537.36";
const fetchAuthData = async (authCookie) => {
  const authPayload = {
    timestamp: ((length = 13), Date.now().toString().substring(0, length)),
    _log_finder_uin: "",
    _log_finder_id: "",
    rawKeyBuff: null,
    pluginSessionId: null,
    scene: 7,
    reqScene: 7,
  };
  var length;
  const authHeaders = {
    cookie: authCookie,
    referer: "https://channels.weixin.qq.com",
  };
  const requestOptions = {
    headers: authHeaders,
  };
  return (
    await axios.post(
      "https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_data",
      authPayload,
      requestOptions
    )
  ).data;
};
async function retrieveFinderCookies(cookiesString) {
  let browser16;
  let context;
  let executablePath3 = cookiesString.executablePath;
  let url5 = cookiesString.url;
  let libsPath5 = cookiesString.libsPath;
  try {
    let isRunning = true;
    let cookieCount = 1;
    const launchOptions = {
      headless: false,
      executablePath: executablePath3,
    };
    const initScript3 = {
      path: libsPath5,
    };
    browser16 = await browserCore.launch(launchOptions);
    context = await browser16.newContext();
    context.addInitScript(initScript3);
    const page4 = await context.newPage();
    for (
      await page4.goto(url5),
        page4.on("close", async () => {
          isRunning = false;
        });
      isRunning;

    ) {
      await sleep(1000);
      cookieCount++;
      const cookies7 = await context.cookies();
      if (cookies7) {
        const cookieString = cookies7
          .map((element) => element.name + "=" + element.value)
          .join("; ");
        try {
          const finderData = await fetchAuthData(cookieString);
          let finderUser = finderData?.["data"]?.["finderUser"];
          if (finderUser) {
            isRunning = false;
            return cookies7;
          }
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  } catch (e) {
    return [];
  } finally {
    if (context) {
      await context.close();
    }
    if (browser16) {
      await browser16.close();
    }
  }
}
async function publishWeixinVideo(currentTimestamp) {
  let browser;
  let browserContext;
  let executablePath = currentTimestamp.executablePath;
  let showInBrowser = currentTimestamp.show;
  let videoPath = currentTimestamp.videoPath;
  let cookies3 = currentTimestamp.cookies;
  let title = currentTimestamp.title || "";
  let topics = currentTimestamp.topics || "";
  let coverImage = currentTimestamp.cover || "";
  let $location = currentTimestamp.location || "";
  let sendTime = currentTimestamp.sendTime;
  let isTimed = currentTimestamp.isTiming;
  let url = currentTimestamp.url;
  let libsPath = currentTimestamp.libsPath;
  let id = currentTimestamp.id || "";
  try {
    const browserConfig = {
      headless: showInBrowser,
      executablePath: executablePath,
    };
    const contextOptions = {
      userAgent: o,
    };
    const initScript = {
      path: libsPath,
    };
    browser = await browserCore.launch(browserConfig);
    browserContext = await browser.newContext(contextOptions);
    browserContext.addInitScript(initScript);
    cookies3.forEach((cache) => {
      if (cache.expires) {
        cache.expires = Math.floor(Date.now() / 1000) + 259200;
      }
    });
    await browserContext.addCookies(cookies3);
    const page = await browserContext.newPage();
    await page.goto(url);
    await page.reload();
    await sleep(1000);
    await page
      .locator('xpath=//div[contains(@class, "upload-content")]')
      .click();
    await sleep(500);
    await page
      .locator('xpath=//div[contains(@class, "upload-wrap")]//input')
      .setInputFiles(videoPath);
    await sleep(5000);
    await page.getByPlaceholder("概括视频主要内容，字数建议6-16个字符").click();
    await sleep(1000);
    await page
      .getByPlaceholder("概括视频主要内容，字数建议6-16个字符")
      .fill(title);
    await page.locator(".input-editor").click();
    await sleep(1000);
    await page.keyboard.type(topics);
    await page.keyboard.press("Enter");
    if ($location) {
      try {
        await page
          .locator('xpath=//div[contains(@class, "post-position-wrap")]')
          .click();
        await sleep(1000);
        await page
          .locator('xpath=//div[contains(@class, "post-position-wrap")]//input')
          .fill($location);
        await sleep(5000);
        await page
          .locator(
            'xpath=//div[contains(@class, "common-option-list-wrap")]/div[2]'
          )
          .click();
      } catch (e) {}
    } else {
      try {
        await page
          .locator('xpath=//div[contains(@class, "post-position-wrap")]')
          .click();
        await sleep(1000);
        await page
          .locator(
            'xpath=//div[contains(@class, "common-option-list-wrap")]//div[contains(text(), "不显示位置")]'
          )
          .click();
      } catch (e) {}
    }
    await sleep(1000);
    if (coverImage) {
      try {
        await page
          .locator(
            'xpath=//*[contains(@class, "post-video-cover-wrap")]//*[contains(@class, "finder-tag-wrap")]'
          )
          .click();
        await sleep(1000);
        await page
          .locator(
            'xpath=//div[contains(@class, "single-cover-uploader-wrap")]'
          )
          .click();
        await sleep(1000);
        await page
          .locator(
            'xpath=//div[contains(@class, "single-cover-uploader-wrap")]/input'
          )
          .setInputFiles(coverImage);
        await sleep(3000);
        try {
          const buttonText = {
            name: "确定",
          };
          await page.getByRole("button", buttonText).click();
        } catch (e) {}
        const confirmButton = {
          name: "确认",
        };
        await sleep(1000);
        await page.getByRole("button", confirmButton).click();
        await sleep(1000);
      } catch (e) {
        try {
          const cancelBtn = {
            name: "取消",
          };
          await page.getByRole("button", cancelBtn).click();
        } catch (e) {}
      }
    }
    if (id) {
      try {
        const filterBtn = {
          name: "筛选",
          exact: true,
        };
        const addBtn = {
          name: "添加",
          exact: true,
        };
        await page
          .locator('xpath=//div[contains(@class, "post-link-wrap")]')
          .click();
        await sleep(1000);
        await page
          .locator('xpath=//div[contains(@class, "link-list-options")]/div[3]')
          .click();
        await sleep(1000);
        await page
          .locator(
            'xpath=//div[contains(@class, "post-component-choose-wrap")]'
          )
          .click();
        await page
          .locator(
            'xpath=//div[contains(@class, "form_item_content_right")]//input'
          )
          .click();
        await sleep(1000);
        await page
          .locator(
            'xpath=//div[contains(@class, "form_item_content_right")]//input'
          )
          .fill(id);
        await sleep(1000);
        await page.getByRole("button", filterBtn).click();
        await sleep(3000);
        await page
          .locator('xpath=//*[contains(@class, "ant-table-tbody")]/tr')
          .click();
        await sleep(1000);
        await page.getByRole("button", addBtn).click();
        await sleep(3000);
      } catch (e) {}
    }
    if (isTimed) {
      try {
        const filterOptions = {
          hasText: "定时",
        };
        await page.locator("label").filter(filterOptions).nth(1).click();
        await sleep(1000);
        await page.getByPlaceholder("请选择发表时间").click();
        let formattedTime = dayjs.unix(sendTime).format("YYYY-MM-DD HH:mm:ss");
        let formattedDate = dayjs(formattedTime).format("YYYY-MM-DD");
        dayjs(formattedTime).format("DD");
        let formattedHour = dayjs(formattedTime).format("HH");
        let formattedMinute = dayjs(formattedTime).format("mm");
        let currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
        if (formattedDate.split("-")[1] > currentTime.split("-")[1]) {
          await page
            .locator(
              "xpath=//*[contains(@class, 'weui-desktop-btn__icon__right')]"
            )
            .click();
        }
        await sleep(200);
        const pickerLinks = await page.$$("table.weui-desktop-picker__table a");
        let dayOfMonth = dayjs(formattedTime).format("D");
        for (let pickerLink of pickerLinks) {
          if (
            (await pickerLink.getAttribute("class")).includes(
              "weui-desktop-picker__disabled"
            )
          ) {
            continue;
          }
          if ((await pickerLink.innerText()).trim() == dayOfMonth) {
            await pickerLink.click();
            break;
          }
        }
        await page.click('input[placeholder="请选择时间"]');
        await page.keyboard.press("Control+A");
        await page.keyboard.type(formattedHour + ":" + formattedMinute);
        await page.locator("div.input-editor").click();
        await sleep(1000);
      } catch (e) {}
    }
    let cookie5 = [1, 2, 3];
    for (let cookie18 of cookie5) {
      try {
        const submitBtn = {
          name: "发表",
          exact: true,
        };
        await page.getByRole("button", submitBtn).click();
        await sleep(5000);
      } catch (e) {}
      if (
        page.url().includes("https://channels.weixin.qq.com/platform/post/list")
      ) {
        return {
          code: 200,
          msg: "发布成功",
        };
      }
      await sleep(1000);
    }
    const launchBrowser = {
      code: 500,
      msg: "wx发布失败",
    };
    return launchBrowser;
  } catch (e) {
    const errorResponse2 = {
      code: 500,
      msg: e,
    };
    return errorResponse2;
  } finally {
    if (browserContext) {
      await browserContext.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}
const fetchXhsUserInfo = async (cookieValue) => {
  const cookieData = {
    cookie: cookieValue,
    referer: "https://creator.xiaohongshu.com/creator/home",
    Authorization: "",
  };
  const requestConfig = {
    headers: cookieData,
  };
  return (
    await axios.get(
      "https://creator.xiaohongshu.com/api/galaxy/user/info",
      requestConfig
    )
  ).data;
};
async function retrieveXhsCookies(cookies) {
  let browser18;
  let browserContext4;
  let executablePath5 = cookies.executablePath;
  let cookieUrl2 = cookies.url;
  let libsPath7 = cookies.libsPath;
  try {
    let isRunning3 = true;
    let cookieCount3 = 1;
    const browserOptions4 = {
      headless: false,
      executablePath: executablePath5,
    };
    const initScript4 = {
      path: libsPath7,
    };
    browser18 = await browserCore.launch(browserOptions4);
    browserContext4 = await browser18.newContext();
    browserContext4.addInitScript(initScript4);
    const page6 = await browserContext4.newPage();
    for (
      await page6.goto(cookieUrl2),
        page6.on("close", async () => {
          isRunning3 = false;
        });
      isRunning3;

    ) {
      await sleep(1000);
      cookieCount3++;
      const cookies9 = await browserContext4.cookies();
      if (cookies9) {
        const cookieString3 = cookies9
          .map((formField) => formField.name + "=" + formField.value)
          .join("; ");
        try {
          const userData2 = await fetchXhsUserInfo(cookieString3);
          let userId = userData2.data?.["userId"];
          if (userId) {
            isRunning3 = false;
            return cookies9;
          }
        } catch (e) {}
      }
    }
    return [];
  } catch (e) {
    return [];
  } finally {
    if (browserContext4) {
      await browserContext4.close();
    }
    if (browser18) {
      await browser18.close();
    }
  }
}
async function publishXhsVideo(buttonClickHandler) {
  let browser4;
  let browserContext2;
  let exePath = buttonClickHandler.executablePath;
  let isVisible = buttonClickHandler.show;
  let videoPath2 = buttonClickHandler.videoPath;
  let cookies4 = buttonClickHandler.cookies;
  let title2 = buttonClickHandler.title || "";
  let topics2 = buttonClickHandler.topics || "";
  let coverImage2 = buttonClickHandler.cover || "";
  let $location2 = buttonClickHandler.location || "";
  let sendTime2 = buttonClickHandler.sendTime;
  let isTiming = buttonClickHandler.isTiming;
  let url2 = buttonClickHandler.url;
  let libsPath2 = buttonClickHandler.libsPath;
  try {
    const browserOpts = {
      // headless: isVisible,
      headless: false,
      executablePath: exePath,
    };
    const userAgent = {
      userAgent: o,
    };
    const initScript2 = {
      path: libsPath2,
    };
    browser4 = await browserCore.launch(browserOpts);
    browserContext2 = await browser4.newContext(userAgent);
    browserContext2.addInitScript(initScript2);
    cookies4.forEach((token) => {
      if (token.expires) {
        token.expires = Math.floor(Date.now() / 1000) + 259200;
      }
    });
    await browserContext2.addCookies(cookies4);
    const page2 = await browserContext2.newPage();
    await page2.goto(url2);
    await page2.reload();
    await sleep(1000);
    await page2.locator('xpath=//div[contains(@class, "drag-over")]').click();
    await sleep(500);
    await page2
      .locator('xpath=//div[contains(@class, "drag-over")]//input')
      .setInputFiles(videoPath2);
    await sleep(5000);
    await page2
      .locator('xpath=//div[contains(@class, "titleInput")]//input')
      .click();
    await sleep(1000);
    await page2
      .locator('xpath=//div[contains(@class, "titleInput")]//input')
      .fill(title2);
    // await page2.locator("#post-textarea").click();
    // await sleep(1000);
    await page2.keyboard.type(topics2);
    await page2.keyboard.press("Enter");
    await sleep(1000);
    if (coverImage2) {
      try {
        const confirmBtn = {
          name: "确定",
        };
        await page2
          .locator('xpath=//div[contains(@class, "operator")]/span[1]')
          .click();
        await sleep(1000);
        await page2
          .locator('xpath=//div[contains(@id, "tab-uploadTab")]')
          .click();
        await sleep(1000);
        await page2
          .locator(
            'xpath=//div[contains(@id, "pane-uploadTab")]//div[contains(@class, "upload-wrapper")]'
          )
          .click();
        await sleep(500);
        await page2
          .locator(
            'xpath=//div[contains(@id, "pane-uploadTab")]//div[contains(@class, "upload-wrapper")]/input'
          )
          .setInputFiles(coverImage2);
        await sleep(4000);
        await page2.getByRole("button", confirmBtn).click();
        await sleep(1000);
      } catch (e) {
        try {
          const cancelButton = {
            name: "取消",
          };
          await page2.getByRole("button", cancelButton).click();
        } catch (e) {}
      }
    }
    (
      await page2.locator(
        '//div[contains(@class, "body")]/div[contains(@class, "content")]'
      )
    )
      .first()
      .click();
    await sleep(500);
    await page2.mouse.wheel(0, 10000);
    await sleep(1000);
    if ($location2) {
      try {
        await page2
          .locator('xpath=//div[contains(@class, "address-box")]//input')
          .click();
        await sleep(1000);
        await page2
          .locator('xpath=//div[contains(@class, "address-box")]//input')
          .fill($location2);
        await sleep(4000);
        await page2
          .locator(
            'xpath=//ul[contains(@class, "el-autocomplete-suggestion")]/li[1]'
          )
          .click();
      } catch (e) {}
    }
    await sleep(1000);
    if (isTiming) {
      try {
        await page2.getByText("定时发布").click();
        await sleep(1000);
        await page2.getByPlaceholder("选择日期和时间").click();
        let formattedDate3 = dayjs
          .unix(sendTime2)
          .format("YYYY-MM-DD HH:mm:ss");
        let formattedDate4 = dayjs(formattedDate3).format("YYYY-MM-DD");
        dayjs(formattedDate3).format("DD");
        let hour3 = dayjs(formattedDate3).format("HH");
        let minutes2 = dayjs(formattedDate3).format("mm");
        let currentDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
        if (formattedDate4.split("-")[1] > currentDate.split("-")[1]) {
          await page2
            .locator('xpath=//button[contains(@aria-label, "下个月")]')
            .click();
        }
        await sleep(200);
        const dateCells = await page2.$$("table.el-date-table td");
        let currentDay = dayjs(formattedDate3).format("D");
        for (let dateCell of dateCells) {
          if ((await dateCell.getAttribute("class")).includes("disabled")) {
            continue;
          }
          if ((await dateCell.innerText()).trim() == currentDay) {
            await dateCell.click();
            break;
          }
        }
        await page2.getByPlaceholder("选择时间").click();
        await page2.keyboard.press("Control+A");
        await page2.keyboard.type(hour3 + ":" + minutes2);
        await sleep(1000);
      } catch (e) {}
    }
    let browserLaunch = [1, 2, 3];
    for (let browser22 of browserLaunch) {
      try {
        await page2
          .locator('xpath=//button[contains(@class, "publishBtn")]')
          .click();
        await sleep(5000);
      } catch (e) {}
      let currentUrl = page2.url();
      if (
        currentUrl.includes(
          "https://creator.xiaohongshu.com/publish/success"
        ) ||
        currentUrl.includes("https://creator.xiaohongshu.com/publish/publish")
      ) {
        return {
          code: 200,
          msg: "发布成功",
        };
      }
      await sleep(1000);
    }
    const modifyCookies = {
      code: 500,
      msg: "xhs发布失败",
    };
    return modifyCookies;
  } catch (e) {
    const errorResponse3 = {
      code: 500,
      msg: e,
    };
    return errorResponse3;
  } finally {
    if (browserContext2) {
      await browserContext2.close();
    }
    if (browser4) {
      await browser4.close();
    }
  }
}
async function publishXhsNote(dateSelector) {
  let execPath = dateSelector.executablePath;
  let showFlag = dateSelector.show;
  let coverList = dateSelector.coverList || [];
  dateSelector.videoPath;
  let cookies6 = dateSelector.cookies;
  let title3 = dateSelector.title || "";
  let topics4 = dateSelector.topics || "";
  dateSelector.cover;
  let browser10;
  let browserCtx;
  let $location4 = dateSelector.location || "";
  let sendTime4 = dateSelector.sendTime;
  let isTiming2 = dateSelector.isTiming;
  let url4 = dateSelector.url;
  let libsPath4 = dateSelector.libsPath;
  try {
    const browserOptions2 = {
      headless: showFlag,
      executablePath: execPath,
    };
    const browserConfig3 = {
      userAgent: o,
    };
    const scriptPath2 = {
      path: libsPath4,
    };
    browser10 = await browserCore.launch(browserOptions2);
    browserCtx = await browser10.newContext(browserConfig3);
    browserCtx.addInitScript(scriptPath2);
    cookies6.forEach((cache2) => {
      if (cache2.expires) {
        cache2.expires = Math.floor(Date.now() / 1000) + 259200;
      }
    });
    await browserCtx.addCookies(cookies6);
    const page3 = await browserCtx.newPage();
    await page3.goto(url4);
    await page3.reload();
    await sleep(1000);
    await page3.getByText("发布笔记").click();
    await sleep(1000);
    await page3
      .locator('xpath=//div[contains(@class, "header")]/div[2]')
      .click();
    await sleep(500);
    await page3.locator('xpath=//div[contains(@class, "drag-over")]').click();
    await sleep(500);
    await page3
      .locator('xpath=//div[contains(@class, "drag-over")]//input')
      .setInputFiles(coverList);
    await sleep(5000);
    await page3
      .locator('xpath=//div[contains(@class, "titleInput")]//input')
      .click();
    await sleep(1000);
    await page3
      .locator('xpath=//div[contains(@class, "titleInput")]//input')
      .fill(title3);
    await sleep(1000);
    await page3.keyboard.type(topics4);
    await page3.keyboard.press("Enter");
    await sleep(1000);
    (
      await page3.locator(
        '//div[contains(@class, "body")]/div[contains(@class, "content")]'
      )
    )
      .first()
      .click();
    await sleep(500);
    await page3.mouse.wheel(0, 10000);
    await sleep(1000);
    if ($location4) {
      try {
        await page3
          .locator('xpath=//div[contains(@class, "address-box")]//input')
          .click();
        await sleep(1000);
        await page3
          .locator('xpath=//div[contains(@class, "address-box")]//input')
          .fill($location4);
        await sleep(4000);
        await page3
          .locator(
            'xpath=//ul[contains(@class, "el-autocomplete-suggestion")]/li[1]'
          )
          .click();
      } catch (e) {}
    }
    await sleep(1000);
    if (isTiming2) {
      try {
        await page3.getByText("定时发布").click();
        await sleep(1000);
        await page3.getByPlaceholder("选择日期和时间").click();
        let formattedDate5 = dayjs
          .unix(sendTime4)
          .format("YYYY-MM-DD HH:mm:ss");
        let formattedDate6 = dayjs(formattedDate5).format("YYYY-MM-DD");
        dayjs(formattedDate5).format("DD");
        let hour4 = dayjs(formattedDate5).format("HH");
        let minute = dayjs(formattedDate5).format("mm");
        let currentDate2 = dayjs().format("YYYY-MM-DD HH:mm:ss");
        if (formattedDate6.split("-")[1] > currentDate2.split("-")[1]) {
          await page3
            .locator('xpath=//button[contains(@aria-label, "下个月")]')
            .click();
        }
        await sleep(200);
        const dateCells2 = await page3.$$("table.el-date-table td");
        let day = dayjs(formattedDate5).format("D");
        for (let dateCell4 of dateCells2) {
          if ((await dateCell4.getAttribute("class")).includes("disabled")) {
            continue;
          }
          if ((await dateCell4.innerText()).trim() == day) {
            await dateCell4.click();
            break;
          }
        }
        await page3.getByPlaceholder("选择时间").click();
        await page3.keyboard.press("Control+A");
        await page3.keyboard.type(hour4 + ":" + minute);
        await sleep(1000);
      } catch (e) {}
    }
    let handleCookies = [1, 2, 3];
    for (let cookie17 of handleCookies) {
      try {
        await page3
          .locator('xpath=//button[contains(@class, "publishBtn")]')
          .click();
        await sleep(5000);
      } catch (e) {}
      let currentUrl2 = page3.url();
      if (
        currentUrl2.includes(
          "https://creator.xiaohongshu.com/publish/success"
        ) ||
        currentUrl2.includes("https://creator.xiaohongshu.com/publish/publish")
      ) {
        return {
          code: 200,
          msg: "发布成功",
        };
      }
      await sleep(1000);
    }
    const handleCookies2 = {
      code: 500,
      msg: "xhs发布失败",
    };
    return handleCookies2;
  } catch (e) {
    const errorResponse4 = {
      code: 500,
      msg: e,
    };
    return errorResponse4;
  } finally {
    if (browserCtx) {
      await browserCtx.close();
    }
    if (browser10) {
      await browser10.close();
    }
  }
}
export {
  retrieveValidCookies as getCookies,
  retrieveFinderCookies as getWxCookies,
  retrieveXhsCookies as getxhsCookies,
  publishVideo as upVideo,
  publishWeixinVideo as upWxVideo,
  publishXhsNote as upxhsPic,
  publishXhsVideo as upxhsVideo,
};
