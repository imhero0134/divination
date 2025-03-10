document.getElementById('calculate-btn').addEventListener('click', async function() {
    const btn = document.getElementById('calculate-btn');
    btn.disabled = true;
    btn.textContent = '分析中...';
    document.getElementById('fortune-analysis').textContent = '';
    const birthDate = document.getElementById('birth-date').value;
    const birthTime = document.getElementById('birth-time').value;
    const zodiacSign = document.getElementById('zodiac-sign').value;

    if (!birthDate || !birthTime || !zodiacSign) {
        alert('请输入完整的生辰八字和星座信息');
        return;
    }

const fortunes = await getAIFortune(birthDate, birthTime, zodiacSign) || calculateFortune(birthDate, birthTime, zodiacSign);

    if (fortunes && fortunes.choices && fortunes.choices[0] && fortunes.choices[0].message) {
        const analysis = fortunes.choices[0].message.content;
        
        document.getElementById('fortune-analysis').innerHTML = analysis.replace(/###/g, '').replace(/\n/g, '<br>');
        btn.disabled = false;
        btn.textContent = '查看运势';
    } else {
        document.getElementById('fortune-analysis').textContent = '暂时无法获取详细分析，请稍后再试';
    btn.disabled = false;
    btn.textContent = '查看运势';
    }
});

function calculateFortune(birthDate, birthTime, zodiacSign) {
    const date = new Date(birthDate + 'T' + birthTime);
    const zodiacFactors = {
        '白羊座': 0.8,
        '金牛座': 0.7,
        '双子座': 0.9,
        '巨蟹座': 0.6,
        '狮子座': 0.85,
        '处女座': 0.75,
        '天秤座': 0.8,
        '天蝎座': 0.9,
        '射手座': 0.85,
        '摩羯座': 0.7,
        '水瓶座': 0.95,
        '双鱼座': 0.65
    };

    const zodiacFactor = zodiacFactors[zodiacSign] || 1;
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const timeFactor = (date.getHours() * 60 + date.getMinutes()) / 1440;

    const todayScore = Math.sin(dayOfYear * 0.0172) * 0.5 + 0.5;
    const weekScore = Math.sin((dayOfYear % 7) * 0.448) * 0.5 + 0.5;
    const monthScore = Math.sin((dayOfYear % 30) * 0.105) * 0.5 + 0.5;

    const fortunes = ['凶', '平', '吉', '大吉'];
    const todayFortune = fortunes[Math.floor((todayScore * zodiacFactor) * 3)];
    const weekFortune = fortunes[Math.floor((weekScore * zodiacFactor) * 3)];
    const monthFortune = fortunes[Math.floor((monthScore * zodiacFactor) * 3)];

    return {
        today: todayFortune,
        week: weekFortune,
        month: monthFortune
    };
}

function calculateMonthlyPayment(loanAmount, interestRate, loanTerm) {
    if (interestRate === 0) {
        return loanAmount / loanTerm;
    }
    return loanAmount * interestRate * Math.pow(1 + interestRate, loanTerm) / (Math.pow(1 + interestRate, loanTerm) - 1);
}

function calculateTotalInterest(monthlyPayment, loanTerm, loanAmount) {
    return monthlyPayment * loanTerm - loanAmount;
}

function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '双鱼座';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '天蝎座';
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
    return '摩羯座';
}
document.getElementById('birth-date').addEventListener('change', function() {
    const date = new Date(this.value);
    const zodiacSign = getZodiacSign(date);
    document.getElementById('zodiac-sign').value = zodiacSign;
});

// 与AI智能体通信的API接口
const API_KEY = 'sk-jxcmpsfblursyxhalsibrswbveifgzljnlmhahzgnrizsamb';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

async function getAIFortune(birthDate, birthTime, zodiacSign) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-vl2',
        messages: [
          {
            role: 'user',
            content: `作为一名专业的运势分析大师，请根据以下信息进行详细分析：\n1. 出生日期：${birthDate}\n2. 出生时间：${birthTime}\n3. 星座：${zodiacSign}\n\n请从以下角度进行运势分析：\n- 今日整体运势\n- 今日爱情运势\n- 今日事业运势\n- 今日财运\n- 今日健康运势\n- 本周重要提示\n- 本月关键机遇\n\n请结合星座特点，给出具体的运势预测和建议。`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('网络请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取AI运势信息失败:', error);
    return null;
  }
}
