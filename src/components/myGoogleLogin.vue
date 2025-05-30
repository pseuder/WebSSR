<template>
  <div class="h-full w-full flex items-center mr-2 overflow-hidden">
    <template v-if="isLogin">
      <div class="flex items-center">
        <el-popover
          placement="bottom"
          :width="100"
          trigger="click"
          popper-class="logout-popover"
        >
          <template #reference>
            <div class="w-20 cursor-pointer text-blue-400 hover:text-blue-600">
              {{ user.name }}
            </div>
          </template>
          <div class="flex flex-col items-center">
            <el-button
              @click="handleLogout"
              type="danger"
              plain
              size="small"
              class="w-full"
            >
              {{ t("logout") }}
            </el-button>
          </div>
        </el-popover>
      </div>
    </template>
    <template v-else>
      <GoogleLogin v-if="isClient" :callback="callback" />
      <div v-else class="w-20 text-gray-400">登入</div>
    </template>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { GoogleLogin, decodeCredential } from "vue3-google-login";
import { useI18n } from "vue-i18n";

import axios, {
  isTokenExpired,
  storeToken,
  storeUserInfo,
  getUserInfo,
  logout,
} from "@/utils/axios";
import { ElMessageBox, ElMessage } from "element-plus";

const { t, locale } = useI18n();

const user = ref(null);
const isLogin = ref(false);
const isClient = ref(typeof window !== 'undefined');

const callback = (response) => {
  user.value = response;
  const userData = decodeCredential(response.credential);
  // sub is the unique identifier for the user
  let { name, email, picture, sub } = userData;

  axios
    .post("/login", {
      email,
      name,
      picture,
      sub,
    })
    .then((response) => {
      storeToken(response.token);
      storeUserInfo({
        email,
        name,
        picture,
        sub,
      });
      isLogin.value = true;
      user.value = getUserInfo();

      // refresh
      location.reload();
    })
    .catch((error) => {
      console.error("Error logging in:", error);

      if(error.code === "ERR_NETWORK") {
        ElMessage.error(t("network_error"));
      }
      else {
        ElMessage.error(t("server_error"));
      }
    });
};

const handleLogout = () => {
  logout();
  isLogin.value = false;

  // refresh
  location.reload();
};

onMounted(() => {
  isLogin.value = !isTokenExpired();
  if (isLogin.value) {
    user.value = getUserInfo();
  }
});
</script>
