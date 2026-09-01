export function makeProfileController(getProfile) {
  return {
    async show(req, res) {
      const profile = await getProfile.execute();
      res.json(profile);
    },
  };
}
