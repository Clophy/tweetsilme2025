console.log("Uygulama başlatıldı!");

const processTweet = async (tweet) => {
  try {
    console.log("Gönderiler geziliyor...");

    const moreButton = tweet.querySelector('button[data-testid="caret"]');
    if (!moreButton) {
      console.warn("Daha fazla butonu bulunamadı. Bu gönderi atlanacak.");
      return false; 
    }

    console.log("Daha fazla butonuna tıklanıyor...");
    moreButton.click();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const deleteOption = Array.from(
      document.querySelectorAll('div[role="menuitem"]')
    ).find((item) => item.textContent.includes("Sil"));

    if (!deleteOption) {
      console.warn("Sil butonu bulunamadı. Bu gönderi atlanacak.");
      return false; 
    }

    console.log("Sil butonuna tıklanıyor...");
    deleteOption.click();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const confirmButton = Array.from(
      document.querySelectorAll('button[data-testid="confirmationSheetConfirm"]')
    ).find((item) => item.textContent.includes("Sil"));

    if (!confirmButton) {
      console.warn("Onayla butonu bulunamadı. Bu gönderi atlanacak.");
      return false; 
    }

    console.log("Sil butonuna tıklanıyor...");
    confirmButton.click();
    console.log("Gönderi silindi.");
    await new Promise((resolve) => setTimeout(resolve, 3000)); 

    return true;
  } catch (error) {
    console.error("Hata", error);
    return false;
  }
};

const deleteTweetsOneByOne = async () => {
  console.log("Teker teker gönderiler siliniyor...");

  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  if (tweets.length === 0) {
    console.error("Tweetler bulunamadı. İşlem iptal edildi.");
    return;
  }

  for (const tweet of tweets) {
    const success = await processTweet(tweet);
    if (!success) {
      console.warn("Sonraki gönderiye geçiliyor...");
    }
  }

  console.log("Gönderilerin hepsi silindi.");
};

const observer = new MutationObserver(() => {
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  if (tweets.length > 0) {
    console.log("Gönderiler yüklendi. Silme işlemi başlatılıyor...");
    observer.disconnect();
    deleteTweetsOneByOne();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
