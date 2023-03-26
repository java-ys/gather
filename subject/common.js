// 求质数
function isPrime(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        if (n % i === 0) {
            sum++;
        }
    }
    return sum === 2
}
// 求范围内所有质数
// getPrimeList(1000)  1000以内所有质数
function getPrimeList(n) {
    const res = []
    for(let i = 0;i<n;i++){
        if(isPrime(i)){
            res.push(i)
        }
    }
    return res
}

// 判断数组是递增的
function isSorted(nums) {
    return nums.every((x, i) => i === 0 || x > nums[i - 1])
}
