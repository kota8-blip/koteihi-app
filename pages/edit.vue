<template>
  <div class="user_container">
    <div class="head">
      <nav :style="`background-image: url('${banner}');`">
        <i
          class="mintui mintui-back"
          @click="$router.go(-1);"
        />
      </nav>
    </div>
    <div class="userName_edit">
      <input
        v-model="userProfile.name"
        type="text"
        placeholder="名前を入力してください"
      >
      <button
        v-if="userProfile.name !== originalName.name"
        :disabled="!isNameValid"
        @click="saveProfileName(userProfile.name)"
      >
        保存
      </button>
      <button
        v-else
        @click="cancel()"
      >
        キャンセル
      </button>
    </div>
    <div class="userPhoneMobile_edit">
      <input
        v-model="userProfile.mobile"
        type="text"
        placeholder="電話番号を入力してください"
      >
      <p
        v-if="mobileError()"
        style="color: red;"
      >
        {{ mobileError() }}
      </p>
      <button
        v-if="userProfile.mobile !== originalName.mobile"
        :disabled="!isMobileValid"
        @click="saveProfileMobile(userProfile.mobile)"
      >
        保存
      </button>
      <button
        v-else
        @click="cancel()"
      >
        キャンセル
      </button>
    </div>
    <div class="userEmail_edit">
      <input
        v-model="userProfile.email"
        type="text"
        placeholder="メールアドレスを入力してください"
      >
      <button
        v-if="userProfile.email !== originalName.email"
        @click="saveProfileEmail(userProfile.email)"
      >
        保存
      </button>
      <button
        v-else
        @click="cancel()"
      >
        キャンセル
      </button>
    </div>
  </div>

</template>

  <script>
  import { mapGetters } from "vuex";
  import Validate from "../assets/utils/validate";
  export default {
    name: "EditPage",

    data() {
      return {
        banner: "/banner1.png", // 例：ダミー画像パス
        userProfile: {},
        originalName: {}
      };
    },
    computed: {
      ...mapGetters("userInfo", ["userInfo"]),
      isNameValid() {
        return Validate.isValidName(this.userProfile.name);
      },
      isMobileValid() {
        return Validate.isValidMobile(this.userProfile.mobile);
      },
      firstNumberValid() {
        return Validate.firstNumberValid(this.userProfile.mobile);
      },
      hasHyphen() {
        return Validate.hasHyphen(this.userProfile.mobile);
      },
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        this.userProfile = { ...this.userInfo};
        this.originalName = { ...this.userInfo}
      },
      saveProfileName(name) {
          this.userProfile.name = name;
          this.originalName.name = name;
          alert('保存しました');
      },
      saveProfileMobile(mobile) {
        this.userProfile.mobile = mobile;
        this.originalName.mobile = mobile;
        alert('保存しました');
      },
      saveProfileEmail(email) {
        if (!Validate.hasAtMark(email)) {
          alert('@を含む有効なメールアドレスを入力してください');
          return;
        }
        this.userProfile.email = email;
        this.originalName.email = email;
        alert('保存しました');
      },
      mobileError() {
        if (this.userProfile.mobile && !this.firstNumberValid) {
          return '電話番号は0から始まる必要があります';
        } else if (this.hasHyphen) {
          return 'ハイフンは入力しないでください';
        }
      },
      cancel() {
        this.userProfile = { ...this.userInfo};
        this.originalName = { ...this.userInfo};
      }
    }
  }
  </script>

 <style>
.user_container {
  padding: 10px;
  background-color: #f0f0f0;
}

.head {
  height: px2rem(200px);
}

nav {
  height: px2rem(200px);
      background-position: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      padding: px2rem(10px);
      position: relative;
}

.mintui-back {
  font-size: px2rem(46px);
  color: #2694ee;
}
</style>
