<template>
    <div class="prize-page">
        <h1 class="prize-title">Prize</h1>
        <h2 class="prize-subtitle">Scotty Cameron Select Newport 2</h2>
        <div class="prize-image-container">
            <!-- Replace 'prize.jpg' with your image filename -->
            <img :src="require('@/assets/scotty.jpg')" alt="Scotty Cameron Select Newport 2" class="prize-image" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'FinalPrize',
};
</script>

<style scoped>
.prize-page {
    max-width: 700px;
    margin: 2rem auto;
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    text-align: center;
}

.prize-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #2c3e50;
    letter-spacing: 1px;
}

.prize-subtitle {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 2rem;
    color: #4a5568;
}

.prize-image-container {
    margin-top: 2rem;
}

.prize-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
}
</style>
