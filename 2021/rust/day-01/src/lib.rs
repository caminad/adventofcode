#[derive(Debug, PartialEq)]
pub struct Report {
    depths: Vec<u32>,
}

impl std::str::FromStr for Report {
    type Err = std::num::ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let depths = s
            .split_whitespace()
            .map(str::parse)
            .collect::<Result<_, _>>()?;
        Ok(Self { depths })
    }
}

impl Report {
    pub fn new(depths: &[u32]) -> Self {
        let depths = depths.to_vec();
        Self { depths }
    }

    pub fn count_increases(&self) -> usize {
        self.depths.windows(2).filter(|w| w[1] > w[0]).count()
    }

    pub fn sum_windows(&self, size: usize) -> Self {
        let depths = self.depths.windows(size).map(|w| w.iter().sum()).collect();
        Self { depths }
    }
}

#[cfg(test)]
mod day_01 {
    use crate::*;

    const INPUT: &str = include_str!("../input.txt");

    const EXAMPLE_INPUT: &str = "199\n200\n208\n210\n200\n207\n240\n269\n260\n263";
    const EXAMPLE_DEPTHS: &[u32] = &[199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

    #[test]
    fn test_parse() {
        assert_eq!(EXAMPLE_INPUT.parse(), Ok(Report::new(EXAMPLE_DEPTHS)));
    }

    #[test]
    fn test_count_increases() {
        assert_eq!(Report::new(EXAMPLE_DEPTHS).count_increases(), 7)
    }

    #[test]
    fn test_count_sum_windows() {
        assert_eq!(
            Report::new(EXAMPLE_DEPTHS).sum_windows(3).depths,
            [607, 618, 618, 617, 647, 716, 769, 792].to_vec()
        )
    }

    #[test]
    fn part_1() {
        let report: Report = INPUT.parse().unwrap();
        assert_eq!(report.count_increases(), 1233)
    }

    #[test]
    fn part_2() {
        let report: Report = INPUT.parse().unwrap();
        assert_eq!(report.sum_windows(3).count_increases(), 1275)
    }
}
