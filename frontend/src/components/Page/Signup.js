import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState("Học viên");
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Nam');
  const [address, setAddress] = useState('');
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [experience, setExperience] = useState('');
  const [userCode, setUserCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userCodeError, setUserCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [dobError, setDobError] = useState('');
  const [experienceError, setExperienceError] = useState('');
  const [isCheckingUserCode, setIsCheckingUserCode] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Hàm lấy toàn bộ dữ liệu người dùng từ tất cả các trang
  const fetchAllUsers = async () => {
    let allUsers = [];
    let page = 0;
    let totalPages = 1;

    try {
      while (page < totalPages) {
        const res = await fetch(`http://localhost:8081/v1/api/user?page=${page}&size=10`, {
          method: 'GET',
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        console.log(`Dữ liệu từ API (page ${page}):`, json);

        if (json.errorStatus !== 900) {
          throw new Error('API trả về lỗi: ' + json.message);
        }

        const users = json.data || [];
        allUsers = [...allUsers, ...users];

        totalPages = json.pagination.totalPages || 1;
        page++;
      }

      console.log('Tất cả userCode:', allUsers.map(user => user.userCode).filter(Boolean));
      console.log('Tất cả email:', allUsers.map(user => user.email).filter(Boolean));
      console.log('Tất cả phone:', allUsers.map(user => user.phone).filter(Boolean));

      return allUsers;
    } catch (err) {
      console.error('Lỗi khi lấy danh sách người dùng:', err);
      throw err;
    }
  };

  // Validation cho Tên đăng nhập
  useEffect(() => {
    const trimmedUserCode = userCode.trim().toLowerCase();

    if (!trimmedUserCode) {
      setUserCodeError('Tên đăng nhập là bắt buộc.');
      setIsCheckingUserCode(false);
      return;
    }

    if (trimmedUserCode.length < 3 || trimmedUserCode.length > 20 || !/^[a-zA-Z0-9]+$/.test(trimmedUserCode)) {
      setUserCodeError('Tên đăng nhập phải từ 3 đến 20 ký tự, chỉ bao gồm chữ cái và số.');
      setIsCheckingUserCode(false);
      return;
    }

    setIsCheckingUserCode(true);
    setIsChecking(true);

    const timeout = setTimeout(async () => {
      try {
        const allUsers = await fetchAllUsers();

        const userExists = allUsers.some(user => {
          const userCodeValue = user.userCode ? user.userCode.toLowerCase().trim() : '';
          return userCodeValue === trimmedUserCode;
        });

        if (userExists) {
          setUserCodeError('Tên đăng nhập đã tồn tại.');
        } else {
          setUserCodeError('');
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra tên đăng nhập:', err);
        setUserCodeError('Không thể kiểm tra tên đăng nhập. Vui lòng thử lại.');
      } finally {
        setIsCheckingUserCode(false);
        setIsChecking(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [userCode]);

  // Validation cho Địa chỉ email
  useEffect(() => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setEmailError('Email là bắt buộc.');
      setIsCheckingEmail(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Email không hợp lệ.');
      setIsCheckingEmail(false);
      return;
    }

    setIsCheckingEmail(true);
    setIsChecking(true);

    const timeout = setTimeout(async () => {
      try {
        const allUsers = await fetchAllUsers();

        const emailExists = allUsers.some(user => {
          const emailValue = user.email ? user.email.toLowerCase().trim() : '';
          return emailValue === trimmedEmail;
        });

        if (emailExists) {
          setEmailError('Email đã được sử dụng.');
        } else {
          setEmailError('');
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra email:', err);
        setEmailError('Không thể kiểm tra email.');
      } finally {
        setIsCheckingEmail(false);
        setIsChecking(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [email]);

  // Validation cho Số điện thoại
  useEffect(() => {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setPhoneError('Số điện thoại là bắt buộc.');
      setIsCheckingPhone(false);
      return;
    }
    if (!/^\d{9,11}$/.test(trimmedPhone)) {
      setPhoneError('Số điện thoại phải từ 9 đến 11 chữ số.');
      setIsCheckingPhone(false);
      return;
    }

    setIsCheckingPhone(true);
    setIsChecking(true);

    const timeout = setTimeout(async () => {
      try {
        const allUsers = await fetchAllUsers();

        const phoneExists = allUsers.some(user => {
          const phoneValue = user.phone ? user.phone.trim() : '';
          return phoneValue === trimmedPhone;
        });

        if (phoneExists) {
          setPhoneError('Số điện thoại đã được sử dụng.');
        } else {
          setPhoneError('');
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra số điện thoại:', err);
        setPhoneError('Không thể kiểm tra số điện thoại.');
      } finally {
        setIsCheckingPhone(false);
        setIsChecking(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [phone]);

  // Validation cho Họ và tên
  useEffect(() => {
    if (name) {
      const trimmedName = name.trim();
      if (!/^[a-zA-Z\sÀ-ỹ]+$/.test(trimmedName)) {
        setNameError('Họ và tên chỉ được chứa chữ cái và khoảng trắng.');
      } else if (trimmedName.length < 2 || trimmedName.length > 50) {
        setNameError('Họ và tên phải từ 2 đến 50 ký tự.');
      } else {
        setNameError('');
      }
    } else {
      setNameError('Họ và tên là bắt buộc.');
    }
  }, [name]);

  // Validation cho Mật khẩu
  useEffect(() => {
    const cleanedPassword = cleanString(password);
    const cleanedConfirmPassword = cleanString(confirmPassword);

    if (password && confirmPassword) {
      if (cleanedPassword !== cleanedConfirmPassword) {
        setPasswordError('Mật khẩu xác nhận không khớp.');
      } else {
        setPasswordError('');
      }
    } else if (!password) {
      setPasswordError('Mật khẩu là bắt buộc.');
    } else if (!confirmPassword) {
      setPasswordError('Nhập lại mật khẩu là bắt buộc.');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const navigate = useNavigate();

  const availableCertificates = [
    "AWS", "OCPJP", "Azure", "GCP", "CCNA", "PMP", "ITIL", "CISSP", "CEH", "CompTIA"
  ];

  const cleanString = (str) => {
    return str.replace(/[^\x20-\x7E]/g, '').trim();
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    if (event.target.value === "Học viên") {
      setSelectedCertificates([]);
      setExperience('');
      setExperienceError('');
    }
  };

  const handleDateChange = (event) => {
    setDob(event.target.value);
  };

  const handleExperienceChange = (event) => {
    setExperience(event.target.value);
  };

  const addCertificate = (certificate) => {
    if (certificate && selectedCertificates.length < 10 && !selectedCertificates.includes(certificate)) {
      setSelectedCertificates([...selectedCertificates, certificate]);
    }
  };

  const removeCertificate = (certificate) => {
    setSelectedCertificates(selectedCertificates.filter((item) => item !== certificate));
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validateInputs = () => {
    let isValid = true;

    if (isChecking) {
      toast.error('Vui lòng đợi kiểm tra hoàn tất.');
      return false;
    }

    setAddressError('');
    setDobError('');
    setExperienceError('');

    if (userCodeError) {
      toast.error(userCodeError);
      isValid = false;
    }

    if (passwordError) {
      toast.error(passwordError);
      isValid = false;
    }

    if (nameError) {
      toast.error(nameError);
      isValid = false;
    }

    if (emailError) {
      toast.error(emailError);
      isValid = false;
    }

    if (phoneError) {
      toast.error(phoneError);
      isValid = false;
    }

    const cleanedPassword = cleanString(password);
    const cleanedConfirmPassword = cleanString(confirmPassword);
    if (!cleanedPassword) {
      setPasswordError('Mật khẩu là bắt buộc.');
      toast.error('Mật khẩu là bắt buộc.');
      isValid = false;
    } else {
      const hasUpperCase = /[A-Z]/.test(cleanedPassword);
      const hasLowerCase = /[a-z]/.test(cleanedPassword);
      const hasDigit = /\d/.test(cleanedPassword);
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(cleanedPassword);
      if (cleanedPassword.length < 5 || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
        setPasswordError('Mật khẩu phải có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
        toast.error('Mật khẩu phải có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.');
        isValid = false;
      }
    }

    if (address && address.length > 255) {
      setAddressError('Địa chỉ không được dài quá 255 ký tự.');
      toast.error('Địa chỉ không được dài quá 255 ký tự.');
      isValid = false;
    }

    if (dob) {
      const birthDate = new Date(dob);
      const currentDate = new Date('2025-04-14');
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = currentDate.getMonth() - birthDate.getMonth();
      const dayDiff = currentDate.getDate() - birthDate.getDate();
      let adjustedAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        adjustedAge--;
      }
      if (isNaN(birthDate.getTime())) {
        setDobError('Ngày sinh không hợp lệ.');
        toast.error('Ngày sinh không hợp lệ.');
        isValid = false;
      } else if (adjustedAge < 16) {
        setDobError('Bạn phải trên 16 tuổi.');
        toast.error('Bạn phải trên 16 tuổi.');
        isValid = false;
      }
    }

    if (role === "Giảng viên" && experience) {
      const expValue = parseInt(experience);
      if (isNaN(expValue) || expValue < 1 || expValue > 20) {
        setExperienceError('Năm kinh nghiệm phải từ 1 đến 20.');
        toast.error('Năm kinh nghiệm phải từ 1 đến 20.');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    if (isLoading) {
      toast.info('Đang xử lý, vui lòng đợi...');
      return;
    }

    setIsLoading(true);

    const roleId = role === "Học viên" ? 3 : 2;
    const genderValue = gender === "Nam" ? 1 : 0;
    const cleanedPassword = cleanString(password);
    const cleanedConfirmPassword = cleanString(confirmPassword);

    const payload = {
      userCode: userCode.trim(),
      name,
      email,
      password: cleanedPassword,
      confirmPassword: cleanedConfirmPassword,
      phone,
      address: address || null,
      dateOfBirth: dob || null,
      roleId,
      statusCode: "ACTIVE",
      experience: role === "Giảng viên" && experience ? parseInt(experience) : null,
      certification: role === "Giảng viên" && selectedCertificates.length > 0 ? selectedCertificates.join(",") : null,
      gender: genderValue,
      createdBy: "SYSTEM"
    };

    try {
      const response = await fetch('http://localhost:8081/v1/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response không phải JSON hợp lệ');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if ((response.status === 201 || response.status === 200) && data.errorStatus === 900) {
        localStorage.setItem('role', roleId === 3 ? 'Học viên' : 'Giảng viên');
        toast.success('Đăng ký thành công!', {
          onClose: () => navigate(roleId === 2 ? '/admin' : '/dashboard'),
        });
      } else {
        let errorMessage = 'Đăng ký thất bại. Vui lòng kiểm tra thông tin.';
        if (data.errorStatus === 901) {
          errorMessage = 'Email hoặc tên đăng nhập đã tồn tại.';
          if (data.message.includes('userCode')) {
            setUserCodeError('Tên đăng nhập đã tồn tại.');
          } else if (data.message.includes('email')) {
            setEmailError('Email đã được sử dụng.');
          } else if (data.message.includes('phone')) {
            setPhoneError('Số điện thoại đã được sử dụng.');
          }
        } else if (data.errorStatus === 902) {
          errorMessage = 'Lỗi hệ thống, vui lòng thử lại sau.';
        } else if (data.errorStatus === 905) {
          errorMessage = 'Mật khẩu xác nhận không khớp.';
          setPasswordError(errorMessage);
        } else if (data.errorStatus === 906) {
          errorMessage = 'Mật khẩu không đủ mạnh. Mật khẩu phải có ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
          setPasswordError(errorMessage);
        } else {
          errorMessage = data.message || errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Lỗi trong quá trình đăng ký:', error);
      toast.error('Đã xảy ra lỗi: ' + error.message, {
        onClose: () => navigate('/login'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    signupBgMain: { backgroundColor: 'white' },
    signupHeader: {  
      backgroundColor: 'rgb(128, 229, 255)',  
      padding: '20px',  
      display: 'flex',  
      justifyContent: 'space-between',  
      alignItems: 'center',  
    },  
    signupLogo: { fontSize: '30px', fontWeight: 'bold', color: '#008cff' },  
    signupNavContainer: { display: 'flex', alignItems: 'center', gap: '16px', margin: '5px' },  
    signupNavLinks: { display: 'flex', justifyContent: 'space-between', listStyleType: 'none', margin: '0', paddingRight: '150px' },  
    signupNavLink: { textDecoration: 'none', padding: '10px 20px', color: '#333' },  
    signupFormContainer: {  
      justifyContent: 'center',  
      alignItems: 'center',  
      width: '100%',  
      maxWidth: '650px',  
      backgroundColor: 'rgb(255, 255, 255)',  
      padding: '50px',  
      borderRadius: '10px',  
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',  
      margin: 'auto',  
      border: '1px solid #88d5ff',
    },  
    signupButtonContainer: {
      display: 'flex',  
      justifyContent: 'center',  
      marginBottom: '16px',
      backgroundColor: '#7cb5ff',
      padding: '15px',
      borderRadius: '20px',
      transition: 'background-color 0.3s',
    },
    signupLoginButton: {
      padding: '15px 50px',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      backgroundColor: '#edf2f7',  
      color: '#005eff',  
      transition: 'background-color 0.3s',
    },
    signupRegisterButton: {
      padding: '15px 50px',
      borderRadius: '50px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      backgroundColor: '#4299e1',  
      color: 'white',
      marginLeft: '20px',
      transition: 'background-color 0.3s',
    },
    signupFormFields: { display: 'flex', flexDirection: 'column', gap: '20px' },  
    signupFormGroup: { display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' },  
    signupFormLabel: { width: '160px', fontWeight: 'bold', textAlign: 'left', marginRight: '15px' },  
    signupConditionalField: { marginLeft: '175px' },  
    signupFormInput: { flex: 1, padding: '12px', border: '1px solid #a8cbff', borderRadius: '4px', boxSizing: 'border-box' },  
    signupFormInputPhone: { flex: '1', padding: '12px', border: '1px solid #a8cbff', borderRadius: '4px', boxSizing: 'border-box' },  
    signupFormSelect: { flex: 1, padding: '12px', border: '1px solid #a8cbff', borderRadius: '4px', boxSizing: 'border-box' },  
    signupFormPhone: { display: 'flex', gap: '10px', minHeight: '48px' },  
    signupFormPassword: { position: 'relative', flex: '1' },  
    signupPasswordIcon: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' },  
    signupFormRadioGroup: { display: 'flex', gap: '10px' },  
    signupFormRadio: { display: 'flex', alignItems: 'center' },  
    signupFormExperience: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },  
    signupFormFooter: { display: 'flex', justifyContent: 'center', marginTop: '25px' },  
    signupFormSubmitBtn: {  
      padding: '15px 40px',  
      border: 'none',  
      backgroundColor: '#008cff',  
      color: 'white',  
      borderRadius: '20px',  
      cursor: 'pointer',  
      fontSize: '20px',  
      textAlign: 'center',  
      transition: 'background-color 0.3s',  
    },  
    signupCertificateContainer: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' },
    signupCertificateItem: { padding: '8px 16px', backgroundColor: '#f0f0f0', borderRadius: '4px', border: '1px solid #ccc', display: 'flex', alignItems: 'center' },
    signupRemoveCertificateButton: { marginLeft: '8px', padding: '4px 8px', backgroundColor: '#dc3545', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', transition: 'background-color 0.3s ease' },
    errorText: { color: 'red', fontSize: '12px', marginTop: '5px', marginLeft: '175px' },
  };

  const hasErrors = !!userCodeError || !!passwordError || !!nameError || !!emailError || !!phoneError || !!addressError || !!dobError || !!experienceError;

  return (
    <div style={styles.signupBgMain}>
      <ToastContainer />
      <header style={styles.signupHeader}>
        <div style={styles.signupLogo}>E LEARNING</div>
        <div style={styles.signupNavContainer}>
          <nav style={styles.signupNavLinks}>
            <a href="#" style={styles.signupNavLink}>Về chúng tôi</a>
            <a href="#" style={styles.signupNavLink}>Khóa học</a>
            <a href="#" style={styles.signupNavLink}>Liên hệ với chúng tôi</a>
            <a href="#" style={styles.signupNavLink}>FAQ's</a>
          </nav>
        </div>
      </header>

      <main style={styles.signupFormContainer}>
        <div style={styles.signupButtonContainer}>
          <Link to="/login">
            <button style={styles.signupLoginButton}>Đăng nhập</button>
          </Link>
          <Link to="/signup">
            <button style={styles.signupRegisterButton}>Đăng ký</button>
          </Link>
        </div>

        <div style={styles.signupFormFields}>
          <div style={styles.signupFormGroup}>
            <label htmlFor="userCode" style={styles.signupFormLabel}>
              Tên đăng nhập <span style={{ color: 'red' }}>*</span>:
            </label>
            <input
              type="text"
              id="userCode"
              style={styles.signupFormInput}
              placeholder="Nhập tên đăng nhập"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              required
            />
          </div>
          {isCheckingUserCode && <div style={styles.errorText}>Đang kiểm tra...</div>}
          {userCodeError && !isCheckingUserCode && <div style={styles.errorText}>{userCodeError}</div>}

          <div style={styles.signupFormGroup}>
            <label htmlFor="password" style={styles.signupFormLabel}>
              Mật khẩu <span style={{ color: 'red' }}>*</span>:
            </label>
            <div style={styles.signupFormPassword}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                style={styles.signupFormInput}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                style={styles.signupPasswordIcon}
                onClick={togglePasswordVisibility}
              ></i>
            </div>
          </div>

          <div style={styles.signupFormGroup}>
            <label htmlFor="confirm-password" style={styles.signupFormLabel}>
              Nhập lại mật khẩu <span style={{ color: 'red' }}>*</span>:
            </label>
            <div style={styles.signupFormPassword}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                style={styles.signupFormInput}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                style={styles.signupPasswordIcon}
                onClick={toggleConfirmPasswordVisibility}
              ></i>
            </div>
          </div>
          {passwordError && <div style={styles.errorText}>{passwordError}</div>}

          <div style={styles.signupFormGroup}>
            <label htmlFor="name" style={styles.signupFormLabel}>
              Họ và tên <span style={{ color: 'red' }}>*</span>:
            </label>
            <input
              type="text"
              id="name"
              style={styles.signupFormInput}
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {nameError && <div style={styles.errorText}>{nameError}</div>}

          <div style={styles.signupFormGroup}>
            <label htmlFor="email" style={styles.signupFormLabel}>
              Địa chỉ email <span style={{ color: 'red' }}>*</span>:
            </label>
            <input
              type="email"
              id="email"
              style={styles.signupFormInput}
              placeholder="cmc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {isCheckingEmail && <div style={styles.errorText}>Đang kiểm tra...</div>}
          {emailError && !isCheckingEmail && <div style={styles.errorText}>{emailError}</div>}

          <div style={styles.signupFormGroup}>
            <label htmlFor="phone" style={styles.signupFormLabel}>
              Số điện thoại <span style={{ color: 'red' }}>*</span>:
            </label>
            <div style={styles.signupFormPhone}>
              <select id="phone-code" style={styles.signupFormSelect}>
                <option value="+84">+84</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+61">+61</option>
                <option value="+81">+81</option>
                <option value="+49">+49</option>
                <option value="+33">+33</option>
                <option value="+91">+91</option>
              </select>
              <input
                type="text"
                id="phone"
                style={styles.signupFormInputPhone}
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          {isCheckingPhone && <div style={styles.errorText}>Đang kiểm tra...</div>}
          {phoneError && !isCheckingPhone && <div style={styles.errorText}>{phoneError}</div>}

          <div style={styles.signupFormGroup}>
            <label htmlFor="address" style={styles.signupFormLabel}>Địa chỉ:</label>
            <input
              type="text"
              id="address"
              style={styles.signupFormInput}
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {addressError && <div style={styles.errorText}>{addressError}</div>}

          <div style={styles.signupFormGroup}>
            <label htmlFor="dob" style={styles.signupFormLabel}>Ngày sinh:</label>
            <input
              type="date"
              id="dob"
              style={styles.signupFormInput}
              value={dob}
              onChange={handleDateChange}
            />
          </div>
          {dobError && <div style={styles.errorText}>{dobError}</div>}

          <div style={styles.signupFormGroup}>
            <label style={styles.signupFormLabel}>
              Quyền đăng ký <span style={{ color: 'red' }}>*</span>:
            </label>
            <div style={styles.signupFormRadioGroup}>
              <label style={styles.signupFormRadio}>
                <input
                  type="radio"
                  name="role"
                  value="Học viên"
                  checked={role === "Học viên"}
                  onChange={handleRoleChange}
                /> Học viên
              </label>
              <label style={styles.signupFormRadio}>
                <input
                  type="radio"
                  name="role"
                  value="Giảng viên"
                  checked={role === "Giảng viên"}
                  onChange={handleRoleChange}
                /> Giảng viên
              </label>
            </div>
          </div>

          {role === "Giảng viên" && (
            <div style={{ ...styles.signupFormGroup, ...styles.signupConditionalField }}>
              <label htmlFor="experience" style={styles.signupFormLabel}>Năm kinh nghiệm:</label>
              <div style={styles.signupFormExperience}>
                <select
                  id="experience"
                  style={styles.signupFormSelect}
                  value={experience}
                  onChange={handleExperienceChange}
                >
                  <option value="">Chọn số năm</option>
                  {[...Array(21).keys()].slice(1).map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span>(năm)</span>
              </div>
            </div>
          )}
          {experienceError && <div style={styles.errorText}>{experienceError}</div>}

          {role === "Giảng viên" && (
            <div style={{ ...styles.signupFormGroup, ...styles.signupConditionalField }}>
              <label htmlFor="certificate" style={styles.signupFormLabel}>Chứng chỉ:</label>
              <div style={styles.signupCertificateContainer}>
                {selectedCertificates.map((certificate, index) => (
                  <div key={index} style={styles.signupCertificateItem}>
                    {certificate}
                    <button
                      type="button"
                      style={styles.signupRemoveCertificateButton}
                      onClick={() => removeCertificate(certificate)}
                    >
                      x
                    </button>
                  </div>
                ))}
                {selectedCertificates.length < 10 && (
                  <select
                    style={styles.signupFormSelect}
                    onChange={(e) => addCertificate(e.target.value)}
                    value=""
                  >
                    <option value="" disabled>Chọn chứng chỉ</option>
                    {availableCertificates.map((certificate, index) => (
                      <option key={index} value={certificate}>{certificate}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}

          <div style={styles.signupFormGroup}>
            <label style={styles.signupFormLabel}>Giới tính:</label>
            <div style={styles.signupFormRadioGroup}>
              <label style={styles.signupFormRadio}>
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={gender === 'Nam'}
                  onChange={(e) => setGender(e.target.value)}
                /> Nam
              </label>
              <label style={styles.signupFormRadio}>
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={gender === 'Nữ'}
                  onChange={(e) => setGender(e.target.value)}
                /> Nữ
              </label>
            </div>
          </div>

          <div style={styles.signupFormFooter}>
            <button
              type="button"
              style={styles.signupFormSubmitBtn}
              onClick={handleSignup}
              disabled={isLoading || isChecking || hasErrors}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;