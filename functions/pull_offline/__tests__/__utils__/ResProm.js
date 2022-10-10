async function ResProm(promise) {
    return await new Promise((resolve, reject) => {
      promise.then(
        (response) => resolve(response),
        (error) => reject(error),
      );
    });
  };

  module.exports.ResProm = ResProm