var app = new Vue({
    el: '#main',
    data: {
        fullName: 'Nattapol Mahipant',
        auth: '',
        myAge: 0,
        registeremail: '',
        registerpassword: '',
        onRegister: false,
        webNameTest: 'society',
        webName: 'yelpi',
        searchFocus: false,
        pageIndex: true,
        pageOnline: false,
        pageGroup: false,
        pageShop: false,
        pageCurrent: 1,
        username: '',
        password: '',
        usersError: false,
        passError: false,
        emailError: false,
        rePassError: false,
        textError: ''
    },
    mounted: function() {
        this.calcuAge();
        if ($("#text-search").val() !== "") {
            $("#text-search").focus();
            $("#text-search").css("width", "100%");
        }
        //this.pageCurrent = JSON.parse(localStorage.getItem("X-pageCurrent"));
        // console.log(this.pageCurrent);
        this.getPages(JSON.parse(localStorage.getItem("X-pageCurrent")));
    },
    created() {

    },
    methods: {
        calcuAge: function() {
            // วันที่ปัจจุบัน
            let today = new Date();

            // วันเกิด
            let birthdate = new Date('1983-07-04');

            // คำนวณ timestamp ของวันที่ปัจจุบัน
            let currentTimestamp = today.getTime();

            // คำนวณ timestamp ของวันเกิด
            let birthTimestamp = birthdate.getTime();

            // คำนวณระยะเวลาที่ผ่านไปในปีที่เกิด
            let yearsPassed = (currentTimestamp - birthTimestamp) / (1000 * 60 * 60 * 24 * 365.25);

            // ลบระยะเวลานี้ออกจาก timestamp ของวันที่ปัจจุบัน
            let birthdateTimestamp = currentTimestamp - (yearsPassed * 1000 * 60 * 60 * 24 * 365.25);

            // แปลง timestamp ของวันเกิดเป็นวันที่
            let birthdateDate = new Date(birthdateTimestamp);

            // แสดงผล
            console.log(today.getFullYear()); // 1990
            this.myAge = (today.getFullYear() - birthdateDate.getFullYear());
        },
        getPages: function(id) {
            if (id) {
                localStorage.setItem('X-pageCurrent', id);
            }
            // app.pageCurrent = JSON.parse(localStorage.getItem("X-pageCurrent"));
            if (id == 1) {
                app.pageIndex = true;
                app.pageOnline = false;
                app.pageGroup = false;
                app.pageShop = false;
            } else if (id == 2) {
                app.pageIndex = false;
                app.pageOnline = true;
                app.pageGroup = false;
                app.pageShop = false;
            } else if (id == 3) {
                app.pageIndex = false;
                app.pageOnline = false;
                app.pageGroup = true;
                app.pageShop = false;
            } else if (id == 4) {
                app.pageIndex = false;
                app.pageOnline = false;
                app.pageGroup = false;
                app.pageShop = true;
            }
        },

        getRegister: async function() {
            app.onRegister = true;
        },
        backLogin: async function() {
            app.onRegister = false;
        },
        onSearchFocus: async function() {
            app.searchFocus = true;
            $("#text-search").focus();
        },
        touchEmoji: function() {
            setTimeout(() => {
                if ($(".open-emoji").hasClass("open")) {
                    $(".open-emoji").removeClass("open");
                    $(".open-emoji").addClass("d-none");
                } else {
                    $(".open-emoji").addClass("open");
                    $(".open-emoji").removeClass("d-none");
                }
            }, 20)
        },
        validateEmail: function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for valid email format
            return emailRegex.test(email); // Return true if email is in valid format, false otherwise
        },
        validateEmail: function(email) {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        },
        cfRegister: async function() {
            if (app.registeremail == '') {
                app.emailError = true;
                app.rePassError = false;
                app.textError = 'กรุณากรอกอีเมล์';
                $("#user-regis").focus();
                return false;
            } else if (app.registerpassword == '') {
                const chkEmail = app.validateEmail(app.registeremail);
                if (!chkEmail) {
                    app.textError = 'รูปแบบอีเมล์ ไม่ถูกต้อง';
                    app.emailError = true;
                    app.rePassError = false;
                    $("#user-regis").focus();
                    return false;
                } else {
                    app.emailError = false;
                    app.rePassError = true;
                    app.textError = 'กรุณาตั้งรหัสผ่าน';
                    $("#pass-regis").focus();
                    return false;
                }

            } else if (app.registerpassword.length < 4) {
                app.emailError = false;
                app.rePassError = true;
                app.textError = 'กรุณาตั้งรหัสผ่านให้มากกว่า 4 หลัก';
                $("#pass-regis").focus();
                return false;
            } else {
                app.emailError = false;
                app.rePassError = false;
                app.textError = '';
                try {
                    const data = axios.post(url, { get: 'register' }, config)
                    localStorage.setItem('X-Token', data.access_token);
                    // localStorage.removeItem('X-Token')
                    app.pawnData = response.data.pawn;
                    app.auth = response.data.username;
                } catch (error) {
                    notification.error({
                        message: t("Error"),
                        description: e.response.data.message,
                    });
                }
            }

        },
        getLogin: async function() {
            if (app.username == '') {
                app.usersError = true;
                app.passError = false;
                $("#user-login").focus();
                return false;
            } else if (app.password == '') {
                app.usersError = false;
                app.passError = true;
                $("#pass-login").focus();
                return false;
            } else {
                app.usersError = false;
                app.passError = false;
                const url = '../server/';
                const config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                try {
                    const data = axios.post(url, { get: 'login' }, config)
                    localStorage.setItem('X-Token', data.access_token);
                    // localStorage.removeItem('X-Token')
                    app.pawnData = response.data.pawn;
                    app.auth = response.data.username;
                } catch (error) {
                    notification.error({
                        message: t("Error"),
                        description: e.response.data.message,
                    });
                    setCampaigns([]);
                }
                // await axios.post(url, {
                //     get: 'fetchall'
                // }, config).then(function(response) {
                //     localStorage.setItem('X-Token', access_token);
                //     // localStorage.removeItem('X-Token')
                //     app.pawnData = response.data.pawn;
                //     app.auth = response.data.username;
                // });
            }
        },
        fetchAllData: async function() {
            const url = '../Controller/';
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            await axios.post(url, {
                get: 'fetchall'
            }, config).then(function(response) {
                app.pawnData = response.data.pawn;
                app.redeemData = response.data.redeem;
                app.interestData = response.data.interest;
                app.saleData = response.data.saleproduct;
                app.buyGoldData = response.data.buygold;
                app.lottoData = response.data.buylotto;
            });
        }
    },
});