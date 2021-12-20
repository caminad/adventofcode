use std::num::ParseIntError;
use std::str::FromStr;

#[derive(Debug, PartialEq)]
pub struct Population([u64; 9]);

impl Population {
    pub fn simulate(&self, days: usize) -> u64 {
        Population(self.0).skip(days - 1).next().unwrap()
    }
}

impl FromIterator<usize> for Population {
    fn from_iter<I: IntoIterator<Item = usize>>(iter: I) -> Self {
        let mut p = Self([0u64; 9]);
        for i in iter {
            p.0[i] += 1;
        }
        p
    }
}

impl FromStr for Population {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        s.trim().split(',').map(|x| x.parse()).collect()
    }
}

impl Iterator for Population {
    type Item = u64;

    fn next(&mut self) -> Option<Self::Item> {
        self.0[7] += self.0[0];
        self.0.rotate_left(1);
        Some(self.0.into_iter().sum())
    }
}

#[cfg(test)]
mod tests {
    use crate::*;

    #[test]
    fn test_from_iter() {
        let p = Population::from_iter([3, 4, 3, 1, 2]);
        assert_eq!(p, Population([0, 1, 1, 2, 1, 0, 0, 0, 0]));
    }

    #[test]
    fn test_from_str() {
        let p = Population::from_str("3,4,3,1,2").unwrap();
        assert_eq!(p, Population([0, 1, 1, 2, 1, 0, 0, 0, 0]));
    }

    #[test]
    fn test_next() {
        let mut p = Population([0, 1, 1, 2, 1, 0, 0, 0, 0]);

        assert_eq!(p.next(), Some(5));
        assert_eq!(p, Population([1, 1, 2, 1, 0, 0, 0, 0, 0]));

        assert_eq!(p.next(), Some(6));
        assert_eq!(p, Population([1, 2, 1, 0, 0, 0, 1, 0, 1]));

        assert_eq!(p.next(), Some(7));
        assert_eq!(p, Population([2, 1, 0, 0, 0, 1, 1, 1, 1]));

        assert_eq!(p.next(), Some(9));
        assert_eq!(p, Population([1, 0, 0, 0, 1, 1, 3, 1, 2]));

        assert_eq!(p.next(), Some(10));
        assert_eq!(p, Population([0, 0, 0, 1, 1, 3, 2, 2, 1]));

        assert_eq!(p.next(), Some(10));
        assert_eq!(p, Population([0, 0, 1, 1, 3, 2, 2, 1, 0]));

        assert_eq!(p.next(), Some(10));
        assert_eq!(p, Population([0, 1, 1, 3, 2, 2, 1, 0, 0]));

        assert_eq!(p.next(), Some(10));
        assert_eq!(p, Population([1, 1, 3, 2, 2, 1, 0, 0, 0]));

        assert_eq!(p.next(), Some(11));
        assert_eq!(p, Population([1, 3, 2, 2, 1, 0, 1, 0, 1]));

        assert_eq!(p.next(), Some(12));
        assert_eq!(p, Population([3, 2, 2, 1, 0, 1, 1, 1, 1]));

        assert_eq!(p.next(), Some(15));
        assert_eq!(p, Population([2, 2, 1, 0, 1, 1, 4, 1, 3]));

        assert_eq!(p.next(), Some(17));
        assert_eq!(p, Population([2, 1, 0, 1, 1, 4, 3, 3, 2]));

        assert_eq!(p.next(), Some(19));
        assert_eq!(p, Population([1, 0, 1, 1, 4, 3, 5, 2, 2]));

        assert_eq!(p.next(), Some(20));
        assert_eq!(p, Population([0, 1, 1, 4, 3, 5, 3, 2, 1]));

        assert_eq!(p.next(), Some(20));
        assert_eq!(p, Population([1, 1, 4, 3, 5, 3, 2, 1, 0]));

        assert_eq!(p.next(), Some(21));
        assert_eq!(p, Population([1, 4, 3, 5, 3, 2, 2, 0, 1]));

        assert_eq!(p.next(), Some(22));
        assert_eq!(p, Population([4, 3, 5, 3, 2, 2, 1, 1, 1]));

        assert_eq!(p.next(), Some(26));
        assert_eq!(p, Population([3, 5, 3, 2, 2, 1, 5, 1, 4]));
    }

    #[test]
    fn test_simulate() {
        let p = Population([0, 1, 1, 2, 1, 0, 0, 0, 0]);
        assert_eq!(p.simulate(18), 26);
        assert_eq!(p.simulate(80), 5934);
        assert_eq!(p.simulate(256), 26984457539);
    }

    #[test]
    fn part_1() {
        let p: Population = include_str!("../input.txt").parse().unwrap();
        assert_eq!(p.simulate(80), 359344);
    }

    #[test]
    fn part_2() {
        let p: Population = include_str!("../input.txt").parse().unwrap();
        assert_eq!(p.simulate(256), 1629570219571);
    }
}
